import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/flow'
import { createAdminClient } from '@/lib/supabase-admin'

// Estados de Flow (getStatus): 1=pendiente, 2=pagado, 3=rechazado, 4=anulado
const STATUS_MAP: Record<number, string> = {
  1: 'pending',
  2: 'completed',
  3: 'cancelled',
  4: 'cancelled',
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const token = form.get('token') as string
    if (!token) return NextResponse.json({ ok: true })

    const payment = await getPaymentStatus(token)
    const status = STATUS_MAP[payment.status] ?? 'pending'

    const supabase = createAdminClient()
    await supabase
      .from('orders')
      .update({
        status,
        mp_payment_id: String(payment.flowOrder),
        updated_at: new Date().toISOString(),
      })
      .eq('external_reference', payment.commerceOrder)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Flow webhook error:', err)
    return NextResponse.json({ ok: true }) // siempre 200 para que Flow no reintente
  }
}
