'use client'

import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'

export interface Cliente {
  id: string
  email: string
  name: string | null
  phone: string | null
  region: string | null
  comuna: string | null
  address: string | null
  pedidos: number
  total_gastado: number
}

const clp = (n: number) => '$' + Math.round(n || 0).toLocaleString('es-CL')
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const selCls = 'border border-[#F3E0D5] rounded-full px-4 py-2.5 text-sm bg-white text-[#155E5B] focus:outline-none focus:ring-2 focus:ring-[#F2A24E]'

export default function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  const [query, setQuery] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [orden, setOrden] = useState('default')
  const q = norm(query.trim())

  let filtered = clientes
  if (q) filtered = filtered.filter(c =>
    norm([c.name, c.email, c.phone, c.comuna, c.region, c.address].filter(Boolean).join(' ')).includes(q),
  )
  if (filtro === 'con') filtered = filtered.filter(c => c.pedidos > 0)
  else if (filtro === 'sin') filtered = filtered.filter(c => c.pedidos === 0)
  if (orden !== 'default') {
    filtered = [...filtered].sort((a, b) => {
      if (orden === 'total_asc') return a.total_gastado - b.total_gastado
      if (orden === 'total_desc') return b.total_gastado - a.total_gastado
      return b.pedidos - a.pedidos // más pedidos
    })
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <MagnifyingGlass weight="bold" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2F7A77]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o comuna…"
            className="w-full border border-[#F3E0D5] rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
          />
        </div>
        <select className={selCls} value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="con">Con compras</option>
          <option value="sin">Sin compras</option>
        </select>
        <select className={selCls} value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="default">Ordenar por…</option>
          <option value="total_desc">Total gastado: mayor a menor</option>
          <option value="total_asc">Total gastado: menor a mayor</option>
          <option value="pedidos">Más pedidos</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FFF6EE] border-b border-[#F3E0D5]">
                <th className="text-left px-5 py-3 font-semibold text-[#155E5B]">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Contacto</th>
                <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Comuna</th>
                <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Pedidos</th>
                <th className="text-right px-4 py-3 font-semibold text-[#155E5B]">Total gastado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-[#F3E0D5] last:border-0 hover:bg-[#FFF1E8] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#155E5B]">{c.name || '—'}</div>
                    <div className="text-xs text-[#2F7A77]">{c.email}</div>
                  </td>
                  <td className="px-4 py-4 text-[#2F7A77]">
                    <div>{c.phone || '—'}</div>
                    {c.address && <div className="text-xs">{c.address}</div>}
                  </td>
                  <td className="px-4 py-4 text-[#2F7A77]">{c.comuna || '—'}</td>
                  <td className="px-4 py-4 text-center">
                    {c.pedidos > 0 ? (
                      <span className="inline-block text-xs px-2.5 py-1 rounded-full font-semibold bg-[#4FB0AB]/20 text-[#2F7A77]">
                        {c.pedidos}
                      </span>
                    ) : (
                      <span className="text-xs text-[#2F7A77]/60">sin compras</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-[#155E5B]">{clp(c.total_gastado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-[#2F7A77]">
              No hay clientes que coincidan con «{query}».
            </p>
          )}
        </div>
      </div>
    </>
  )
}
