import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import { PlusCircle, PencilSimple } from '@phosphor-icons/react/dist/ssr'
import { formatPrice } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function AdminProductosPage() {
  const supabase = createAdminClient()
  const { data: productos } = await supabase
    .from('products')
    .select('id, name, category, price, stock, access, active')
    .order('category', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#155E5B]">Productos</h1>
          <p className="text-[#2F7A77] mt-1">{productos?.length ?? 0} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-[#155E5B] text-[#FFF6EE] px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#2F7A77] transition-colors"
        >
          <PlusCircle weight="fill" size={18} />
          Nuevo producto
        </Link>
      </div>

      {!productos?.length ? (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-16 text-center">
          <p className="text-[#2F7A77] mb-4">No hay productos aún.</p>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 bg-[#155E5B] text-[#FFF6EE] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2F7A77] transition-colors"
          >
            <PlusCircle weight="fill" size={16} />
            Crear primer producto
          </Link>
        </div>
      ) : (
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
              {productos.map(p => (
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
        </div>
      )}
    </div>
  )
}
