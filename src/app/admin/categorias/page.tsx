import { getCategoriesWithCount } from '@/lib/categories-db'
import CategoriasManager from './CategoriasManager'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categories = await getCategoriesWithCount()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#155E5B]">Categorías</h1>
        <p className="text-[#2F7A77] mt-1">
          Gestiona las categorías de productos. Se usan en el editor de productos y en los filtros de la tienda.
        </p>
      </div>
      <CategoriasManager categories={categories} />
    </div>
  )
}
