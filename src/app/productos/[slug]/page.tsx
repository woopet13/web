import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProductBySlug, getProductsByAnimal } from '@/lib/products-db'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  const url = `${SITE_URL}/productos/${product.slug}`
  const image = product.image ? absoluteUrl(product.image) : absoluteUrl(DEFAULT_OG_IMAGE)
  const description = product.description || `${product.name} — disponible en Woopet Pet Shop. Despacho a todo Chile.`

  return {
    title: product.name,
    description,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      type: 'website',
      url,
      title: product.name,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [image],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = (await getProductsByAnimal(product.animal))
    .filter(p => p.slug !== product.slug)
    .slice(0, 4)

  // Datos estructurados (JSON-LD) para resultados enriquecidos en Google.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: [product.image ? absoluteUrl(product.image) : absoluteUrl(DEFAULT_OG_IMAGE)],
    ...(product.sku ? { sku: product.sku } : {}),
    category: product.category,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/productos/${product.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  )
}
