import ProductoEditor from '../ProductoEditor'
import { getCategories } from '@/lib/categories-db'

export const dynamic = 'force-dynamic'

export default async function NuevoProductoPage() {
  const categories = await getCategories()
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[#155E5B] mb-8">Nuevo producto</h1>
      <ProductoEditor categories={categories} />
    </div>
  )
}
