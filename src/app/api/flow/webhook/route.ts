import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/flow'
import { pool } from '@/lib/db'
import {
  sendMail, ADMIN_EMAIL, orderConfirmationEmail, adminSaleEmail, lowStockEmail,
  type OrderForEmail,
} from '@/lib/mail'

// Estados de Flow (getStatus): 1=pendiente, 2=pagado, 3=rechazado, 4=anulado
const STATUS_MAP: Record<number, string> = {
  1: 'pending',
  2: 'completed',
  3: 'cancelled',
  4: 'cancelled',
}

function asArray(v: unknown): any[] {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim()) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
  }
  return []
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const token = form.get('token') as string
    if (!token) return NextResponse.json({ ok: true })

    const payment = await getPaymentStatus(token)
    const status = STATUS_MAP[payment.status] ?? 'pending'

    // Estado actual (para detectar la transición a "pagado" una sola vez).
    const { rows } = await pool.query(
      `SELECT * FROM orders WHERE external_reference = $1 LIMIT 1`,
      [payment.commerceOrder],
    )
    const order = rows[0]
    if (!order) return NextResponse.json({ ok: true })

    const wasCompleted = order.status === 'completed'

    await pool.query(
      `UPDATE orders SET status = $1, mp_payment_id = $2, updated_at = now() WHERE external_reference = $3`,
      [status, String(payment.flowOrder), payment.commerceOrder],
    )

    // Solo la PRIMERA vez que pasa a pagado: correos + descuento de stock.
    if (!wasCompleted && status === 'completed') {
      const items = asArray(order.items)
      const orderForEmail: OrderForEmail = {
        external_reference: order.external_reference,
        user_email: order.user_email,
        items,
        total: order.total,
        shipping_cost: order.shipping_cost ?? 0,
        shipping_method: order.shipping_method ?? undefined,
        shipping_address: order.shipping_address ?? null,
      }

      // Correos al cliente y al admin (no bloquean si el SMTP falla).
      await Promise.allSettled([
        sendMail({ to: order.user_email, ...orderConfirmationEmail(orderForEmail) }),
        ADMIN_EMAIL ? sendMail({ to: ADMIN_EMAIL, ...adminSaleEmail(orderForEmail) }) : Promise.resolve(false),
      ])

      // Descuenta stock de lo comprado y junta lo que quede en crítico.
      const lowStock: { name: string; stock: number; threshold: number }[] = []
      for (const it of items) {
        if (!it?.id) continue
        const qty = Number(it.quantity ?? 1)
        try {
          const { rows: pr } = await pool.query(
            `UPDATE products SET stock = GREATEST(0, stock - $1), updated_at = now()
             WHERE id = $2 RETURNING name, stock, low_stock_threshold`,
            [qty, it.id],
          )
          const p = pr[0]
          if (p && p.stock <= (p.low_stock_threshold ?? 5)) {
            lowStock.push({ name: p.name, stock: p.stock, threshold: p.low_stock_threshold ?? 5 })
          }
        } catch (e) {
          console.error('[webhook] stock update falló para', it.id, e)
        }
      }

      if (lowStock.length && ADMIN_EMAIL) {
        await sendMail({ to: ADMIN_EMAIL, ...lowStockEmail(lowStock) })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Flow webhook error:', err)
    return NextResponse.json({ ok: true }) // siempre 200 para que Flow no reintente
  }
}
