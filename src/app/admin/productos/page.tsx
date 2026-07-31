import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'
import ProductosTable from './ProductosTable'

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
        <ProductosTable productos={productos} />
      )}
    </div>
  )
}
