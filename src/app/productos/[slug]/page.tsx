import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProductBySlug, getProductsByAnimal } from '@/lib/products-db'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Woopet Pet Shop`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = (await getProductsByAnimal(product.animal))
    .filter(p => p.slug !== product.slug)
    .slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
