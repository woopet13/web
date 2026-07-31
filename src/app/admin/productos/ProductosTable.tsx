'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass } from '@phosphor-icons/react'
import { formatPrice } from '@/lib/products'

interface Producto {
  id: string
  name: string
  category: string
  price: number
  stock: number
  access: string
  active: boolean
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function ProductosTable({ productos }: { productos: Producto[] }) {
  const [query, setQuery] = useState('')
  const q = norm(query.trim())
  const filtered = q
    ? productos.filter(p => norm(p.name).includes(q) || norm(p.category ?? '').includes(q))
    : productos

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <MagnifyingGlass weight="bold" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2F7A77]" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre o categoría…"
          className="w-full border border-[#F3E0D5] rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FFF6EE] border-b border-[#F3E0D5]">
              <th className="text-left px-5 py-3 font-semibold text-[#155E5B]">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Categoría</th>
              <th className="text-right px-4 py-3 font-semibold text-[#155E5B]">Precio</th>
              <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Stock</th>
              <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Acceso</th>
              <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-[#F3E0D5] last:border-0 hover:bg-[#FFF1E8] transition-colors">
                <td className="px-5 py-4 font-medium text-[#155E5B]">{p.name}</td>
                <td className="px-4 py-4 text-[#2F7A77]">{p.category}</td>
                <td className="px-4 py-4 text-right text-[#155E5B]">{formatPrice(p.price)}</td>
                <td className="px-4 py-4 text-center text-[#2F7A77]">{p.stock}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                    p.access === 'members'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-[#4FB0AB]/20 text-[#4FB0AB]'
                  }`}>
                    {p.access === 'members' ? 'Miembros' : 'Público'}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                    p.active
                      ? 'bg-[#4FB0AB]/20 text-[#4FB0AB]'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#F2A24E] hover:underline font-medium"
                  >
                    <PencilSimple weight="bold" size={13} />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-[#2F7A77]">
            No hay productos que coincidan con «{query}».
          </p>
        )}
      </div>
    </>
  )
}
