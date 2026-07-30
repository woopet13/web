import { NextRequest, NextResponse } from 'next/server'
import { quoteShipping, estimateCartWeightKg } from '@/lib/blue'

interface QuoteBody {
  regionName?: string
  comuna?: string
  items?: { weight?: string; quantity?: number }[]
}

export async function POST(req: NextRequest) {
  try {
    const { regionName, comuna, items }: QuoteBody = await req.json()

    if (!regionName || !comuna) {
      return NextResponse.json({ error: 'Falta región o comuna' }, { status: 400 })
    }

    const weightKg = estimateCartWeightKg(
      (items ?? []).map(i => ({ weight: i.weight, quantity: i.quantity ?? 1 })),
    )

    const quote = await quoteShipping({ regionName, comuna, weightKg })
    return NextResponse.json(quote)
  } catch (err) {
    console.error('Shipping quote error:', err)
    return NextResponse.json({ error: 'No se pudo cotizar el despacho' }, { status: 500 })
  }
}
