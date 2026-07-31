import type { MetadataRoute } from 'next'
import { pool } from '@/lib/db'
import { SITE_URL } from '@/lib/site'

// Refleja siempre lo que hay en la base (productos/posts se editan en el admin).
export const dynamic = 'force-dynamic'

interface SlugRow {
  slug: string
  updated_at: string | Date | null
}

function toDate(v: string | Date | null): Date {
  if (!v) return new Date()
  return v instanceof Date ? v : new Date(v)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rutas estáticas públicas.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,          changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/productos`, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/blog`,      changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE_URL}/nosotros`,  changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contacto`,  changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/terminos`,  changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/legalidad`, changeFrequency: 'yearly',  priority: 0.2 },
  ]

  let products: MetadataRoute.Sitemap = []
  let posts: MetadataRoute.Sitemap = []

  try {
    const { rows } = await pool.query<SlugRow>(
      `SELECT slug, updated_at FROM products WHERE active = true ORDER BY updated_at DESC`,
    )
    products = rows.map(r => ({
      url: `${SITE_URL}/productos/${r.slug}`,
      lastModified: toDate(r.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    // Si la BD no responde, devolvemos igual las rutas estáticas.
  }

  try {
    const { rows } = await pool.query<SlugRow>(
      `SELECT slug, created_at AS updated_at FROM blog_posts WHERE published = true ORDER BY created_at DESC`,
    )
    posts = rows.map(r => ({
      url: `${SITE_URL}/blog/${r.slug}`,
      lastModified: toDate(r.updated_at),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  } catch {
    // idem
  }

  return [...staticRoutes, ...products, ...posts]
}
