import { NextRequest, NextResponse } from 'next/server'
import { createPayment } from '@/lib/flow'
import { createAdminClient } from '@/lib/supabase-admin'

interface ShippingInfo {
  cost: number
  carrier?: string
  service?: string
  etaMin?: number
  etaMax?: number
}

export async function POST(req: NextRequest) {
  const { items, total, shipping, address, email, userId } = await req.json()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const commerceOrder = `CF-${Date.now()}`

  const shippingCost = Math.round((shipping as ShippingInfo)?.cost ?? 0)
  const grandTotal = Math.round(total) + shippingCost

  try {
    const supabase = createAdminClient()
    const [, payment] = await Promise.all([
      supabase.from('orders').insert({
        external_reference: commerceOrder,
        user_id: userId ?? null,
        user_email: email,
        items,
        total: grandTotal,
        shipping_cost: shippingCost,
        shipping_method: (shipping as ShippingInfo)?.carrier ?? 'Blue Express',
        shipping_address: address ?? null,
        status: 'pending',
      }),
      createPayment({
        commerceOrder,
        subject: 'Woopet — Pedido',
        amount: grandTotal,
        email,
        urlConfirmation: `${siteUrl}/api/flow/webhook`,
        urlReturn: `${siteUrl}/checkout/success?order=${commerceOrder}`,
      }),
    ])

    return NextResponse.json({ url: `${payment.url}?token=${payment.token}` })
  } catch (err) {
    console.error('Flow create error:', err)
    return NextResponse.json({ error: 'No se pudo iniciar el pago' }, { status: 500 })
  }
}
