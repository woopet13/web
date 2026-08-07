'use client'

import { useState } from 'react'
import OrderStatusSelect from './OrderStatusSelect'
import { EnvelopeSimple, Phone, MapPin, Package, CalendarBlank, MagnifyingGlass } from '@phosphor-icons/react'

const clp = (n: number) => '$' + Math.round(n || 0).toLocaleString('es-CL')

function fecha(d: string) {
  return new Date(d).toLocaleString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const ESTADOS: Record<string, string> = {
  pending: 'Pendiente', processing: 'En proceso', completed: 'Completado', cancelled: 'Cancelado',
}

interface Item { name?: string; price?: number; quantity?: number }
interface Address {
  name?: string; phone?: string; region?: string; comuna?: string; address?: string; reference?: string
}
export interface Order {
  id: string
  external_reference: string | null
  user_email: string | null
  items: unknown
  total: number
  status: string
  shipping_cost: number | null
  shipping_method: string | null
  shipping_address: Address | null
  created_at: string
}

function toItems(v: unknown): Item[] {
  if (Array.isArray(v)) return v as Item[]
  if (typeof v === 'string' && v.trim()) { try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] } }
  return []
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const selCls = 'border border-[#F3E0D5] rounded-full px-4 py-2.5 text-sm bg-white text-[#155E5B] focus:outline-none focus:ring-2 focus:ring-[#F2A24E]'

export default function PedidosList({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState('')
  const [estado, setEstado] = useState('todos')
  const [orden, setOrden] = useState('recientes')
  const q = norm(query.trim())

  let filtered = orders
  if (q) filtered = filtered.filter(o => {
    const a = o.shipping_address ?? {}
    const hay = [
      o.external_reference, o.user_email, a.name, a.phone, a.comuna, a.region, a.address,
      ESTADOS[o.status] ?? o.status,
    ].filter(Boolean).join(' ')
    return norm(hay).includes(q)
  })
  if (estado !== 'todos') filtered = filtered.filter(o => o.status === estado)
  filtered = [...filtered].sort((a, b) => {
    if (orden === 'total_asc') return a.total - b.total
    if (orden === 'total_desc') return b.total - a.total
    const da = new Date(a.created_at).getTime(), db = new Date(b.created_at).getTime()
    return orden === 'antiguos' ? da - db : db - da
  })

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <MagnifyingGlass weight="bold" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2F7A77]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por pedido, email, nombre, comuna o estado…"
            className="w-full border border-[#F3E0D5] rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
          />
        </div>
        <select className={selCls} value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="processing">En proceso</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <select className={selCls} value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="total_asc">Total: menor a mayor</option>
          <option value="total_desc">Total: mayor a menor</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-12 text-center text-[#2F7A77]">
          No hay pedidos que coincidan con «{query}».
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const addr: Address = order.shipping_address ?? {}
            const items = toItems(order.items)
            const subtotal = order.total - (order.shipping_cost ?? 0)
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-[#F3E0D5] shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF6EE] px-5 py-3 border-b border-[#F3E0D5]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-[#155E5B]">
                      {order.external_reference ?? order.id.slice(0, 8)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#2F7A77]">
                      <CalendarBlank weight="fill" size={13} /> {fecha(order.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-extrabold text-[#F0846E]">{clp(order.total)}</span>
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#2F7A77] mb-2">Cliente</p>
                    <div className="space-y-1.5 text-sm text-[#155E5B]">
                      {addr.name && <p className="font-medium">{addr.name}</p>}
                      <p className="flex items-center gap-1.5 break-all">
                        <EnvelopeSimple weight="fill" size={14} className="text-[#F2A24E] shrink-0" /> {order.user_email ?? '—'}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone weight="fill" size={14} className="text-[#F2A24E] shrink-0" /> {addr.phone || '—'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#2F7A77] mb-2">Despacho</p>
                    <div className="space-y-1 text-sm text-[#155E5B]">
                      <p className="flex items-start gap-1.5">
                        <MapPin weight="fill" size={14} className="text-[#F2A24E] shrink-0 mt-0.5" />
                        <span>
                          {addr.address || '—'}{addr.reference ? `, ${addr.reference}` : ''}<br />
                          {[addr.comuna, addr.region].filter(Boolean).join(', ') || ''}
                        </span>
                      </p>
                      <p className="text-xs text-[#2F7A77] pl-5">
                        {order.shipping_method ?? 'Blue Express'} · {clp(order.shipping_cost ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#2F7A77] mb-2">
                      <Package weight="fill" size={13} className="inline mr-1 text-[#F2A24E]" />
                      Productos
                    </p>
                    <div className="space-y-1 text-sm text-[#155E5B]">
                      {items.length === 0 && <p className="text-[#2F7A77]">—</p>}
                      {items.map((it, i) => (
                        <div key={i} className="flex justify-between gap-2">
                          <span className="truncate">{it.name} <span className="text-[#2F7A77]">× {it.quantity ?? 1}</span></span>
                          <span className="shrink-0">{clp((it.price ?? 0) * (it.quantity ?? 1))}</span>
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-[#F3E0D5] flex justify-between text-xs text-[#2F7A77]">
                        <span>Subtotal</span><span>{clp(subtotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
