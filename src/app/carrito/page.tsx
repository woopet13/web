'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/products'
import { Trash, Plus, Minus, ShoppingCartSimple, CreditCard, ShieldCheck, Truck, MapPin } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { REGIONS } from '@/lib/chile-regions'

interface ShippingQuote {
  cost: number
  etaMin: number
  etaMax: number
  service: string
  carrier: string
  weightKg: number
  source: string
}

const inputCls =
  'w-full border border-[#F3E0D5] rounded-xl px-4 py-2.5 text-[#155E5B] focus:outline-none focus:border-[#F0846E] focus:ring-2 focus:ring-[#F0846E]/20 transition-colors bg-[#FFFBF7]'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  // Datos de envío
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [address, setAddress] = useState('')
  const [reference, setReference] = useState('')

  const [quote, setQuote] = useState<ShippingQuote | null>(null)
  const [quoting, setQuoting] = useState(false)

  const comunas = useMemo(
    () => REGIONS.find(r => r.name === region)?.comunas ?? [],
    [region],
  )

  // Restaura los datos de despacho (sobreviven al redirect de login).
  useEffect(() => {
    const saved = localStorage.getItem('woopet-checkout')
    if (saved) {
      try {
        const d = JSON.parse(saved)
        setName(d.name ?? '')
        setEmail(d.email ?? '')
        setPhone(d.phone ?? '')
        setRegion(d.region ?? '')
        setComuna(d.comuna ?? '')
        setAddress(d.address ?? '')
        setReference(d.reference ?? '')
      } catch {}
    }
    // Si hay sesión, prellena email y nombre.
    createClient().auth.getUser().then(({ data }) => {
      const u = data.user as { email?: string; full_name?: string } | null
      if (u?.email) setEmail(prev => prev || u.email!)
      if (u?.full_name) setName(prev => prev || u.full_name!)
    }).catch(() => {})
  }, [])

  // Guarda los datos de despacho ante cualquier cambio.
  useEffect(() => {
    localStorage.setItem(
      'woopet-checkout',
      JSON.stringify({ name, email, phone, region, comuna, address, reference }),
    )
  }, [name, email, phone, region, comuna, address, reference])

  // Al cambiar de región (elegida por el usuario), resetea la comuna.
  function changeRegion(value: string) {
    setRegion(value)
    setComuna('')
    setQuote(null)
  }

  // Cotiza el despacho con Blue cuando hay región + comuna (y al cambiar el carrito).
  useEffect(() => {
    if (!region || !comuna || items.length === 0) {
      setQuote(null)
      return
    }
    let cancelled = false
    setQuoting(true)
    fetch('/api/shipping/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        regionName: region,
        comuna,
        items: items.map(i => ({ weight: i.weight, quantity: i.quantity })),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        setQuote(data?.cost ? data : null)
      })
      .catch(() => !cancelled && setQuote(null))
      .finally(() => !cancelled && setQuoting(false))
    return () => {
      cancelled = true
    }
  }, [region, comuna, items])

  const shippingCost = quote?.cost ?? 0
  const grandTotal = total + shippingCost
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const addressComplete = Boolean(name && emailOk && phone && region && comuna && address)

  async function handleCheckout() {
    if (!addressComplete || !quote) return
    setLoading(true)
    // No exige login: si hay sesión, se asocia el pedido; si no, compra como invitado.
    const { data } = await createClient().auth.getUser()
    const userId = (data.user as { id?: string } | null)?.id ?? null

    try {
      const res = await fetch('/api/flow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          shipping: {
            cost: quote.cost,
            carrier: quote.carrier,
            service: quote.service,
            etaMin: quote.etaMin,
            etaMax: quote.etaMax,
          },
          address: { name, phone, region, comuna, address, reference },
          email,
          userId,
        }),
      })
      const json = await res.json()
      if (json.url) {
        clearCart()
        window.location.href = json.url
      } else {
        alert('Error al iniciar el pago. Intenta de nuevo.')
      }
    } catch {
      alert('Error de conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingCartSimple weight="thin" size={80} className="text-[#F2A24E] mx-auto mb-6" />
        <h2 className="font-display text-3xl font-bold text-[#155E5B] mb-3">Tu carrito está vacío</h2>
        <p className="text-[#2F7A77] mb-8">Agrega productos para comenzar tu pedido.</p>
        <Link href="/productos" className="bg-[#F0846E] text-white px-8 py-3 rounded-full hover:bg-[#E0654E] transition-colors">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-[#155E5B] mb-8">Tu carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items + dirección */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 border border-[#F3E0D5] shadow-sm">
              <div
                className="relative w-20 h-20 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden"
                style={{ backgroundImage: `linear-gradient(135deg, ${item.gradient?.[0] ?? '#3FA9A2'}, ${item.gradient?.[1] ?? '#F0846E'})` }}
              >
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1.5 drop-shadow" />
                ) : (item.emoji ?? '🐾')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-[#155E5B] text-base leading-tight">{item.name}</h3>
                <p className="text-[#F0846E] font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-[#F3E0D5] flex items-center justify-center hover:bg-[#F3E0D5] transition-colors"
                  >
                    <Minus weight="bold" size={13} />
                  </button>
                  <span className="text-[#155E5B] font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-[#F3E0D5] flex items-center justify-center hover:bg-[#F3E0D5] transition-colors"
                  >
                    <Plus weight="bold" size={13} />
                  </button>
                  <span className="text-[#2F7A77] text-sm ml-2">= {formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-[#F0846E] hover:text-[#E0654E] transition-colors self-start"
              >
                <Trash weight="fill" size={18} />
              </button>
            </div>
          ))}

          {/* Dirección de despacho */}
          <div className="bg-white rounded-2xl p-6 border border-[#F3E0D5] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin weight="fill" size={20} className="text-[#F0846E]" />
              <h2 className="font-display font-bold text-[#155E5B] text-lg">Dirección de despacho</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Nombre de quien recibe</label>
                <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Nombre y apellido" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Email</label>
                <input type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Teléfono</label>
                <input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+56 9 ..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Región</label>
                <select className={inputCls} value={region} onChange={e => changeRegion(e.target.value)}>
                  <option value="">Selecciona…</option>
                  {REGIONS.map(r => (
                    <option key={r.code} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Comuna</label>
                <select className={inputCls} value={comuna} onChange={e => setComuna(e.target.value)} disabled={!region}>
                  <option value="">{region ? 'Selecciona…' : 'Elige región primero'}</option>
                  {comunas.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Dirección (calle y número)</label>
                <input className={inputCls} value={address} onChange={e => setAddress(e.target.value)} placeholder="Av. Siempreviva 742" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Depto / referencia (opcional)</label>
                <input className={inputCls} value={reference} onChange={e => setReference(e.target.value)} placeholder="Depto 301, timbre azul…" />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-[#F3E0D5] shadow-sm sticky top-24">
            <h2 className="font-display font-bold text-[#155E5B] text-xl mb-6">Resumen</h2>
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-[#2F7A77]">
                  <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F3E0D5] pt-4 space-y-2 mb-2">
              <div className="flex justify-between text-sm text-[#2F7A77]">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#2F7A77]">
                <span className="flex items-center gap-1.5">
                  <Truck weight="fill" size={15} className="text-[#4FB0AB]" /> Despacho
                </span>
                <span>
                  {quoting
                    ? 'Cotizando…'
                    : quote
                      ? formatPrice(quote.cost)
                      : region && comuna
                        ? '—'
                        : 'Ingresa comuna'}
                </span>
              </div>
              {quote && (
                <p className="text-xs text-[#2F7A77]/80 leading-snug">
                  {quote.carrier} · {quote.service} · llega en {quote.etaMin}-{quote.etaMax} días hábiles
                </p>
              )}
            </div>

            <div className="border-t border-[#F3E0D5] pt-4 mb-6">
              <div className="flex justify-between font-bold text-[#155E5B] text-lg">
                <span>Total</span>
                <span className="text-[#F0846E]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !addressComplete || !quote || quoting}
              className="w-full bg-[#F0846E] text-white py-4 rounded-xl font-medium hover:bg-[#E0654E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            >
              <CreditCard weight="fill" size={20} />
              {loading ? 'Procesando...' : 'Pagar con Flow'}
            </button>
            {!addressComplete && (
              <p className="text-xs text-center text-[#F0846E] mt-3">
                Completa tu dirección de despacho para continuar.
              </p>
            )}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <ShieldCheck weight="fill" size={14} className="text-[#4FB0AB]" />
              <p className="text-xs text-[#2F7A77]">Pago seguro · Tarjetas, débito y transferencia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
