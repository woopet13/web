import ProductsClient from './ProductsClient'
import { getProducts } from '@/lib/products-db'

export const metadata = {
  title: 'Productos | Woopet Pet Shop',
  description: 'Snacks, alimento completo y arena para perros y gatos. Marcas Wanpy y Cateko.',
}

// Siempre refleja lo que hay en la base (el admin es la fuente de verdad).
export const dynamic = 'force-dynamic'

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ animal?: string }>
}) {
  const { animal } = await searchParams
  const initialAnimal = animal === 'dog' || animal === 'cat' ? animal : 'all'
  const allProducts = await getProducts()
  return <ProductsClient allProducts={allProducts} initialAnimal={initialAnimal} />
}
