import 'server-only'
import { pool } from './db'
import { getVisuals } from './products'
import type { Product, PetAnimal, ProductVariant } from '@/types'

// Fila cruda de la tabla `products`.
interface Row {
  id: string
  slug: string
  name: string
  description: string | null
  long_description: string | null
  price: number
  image: string | null
  category: string
  access: string | null
  stock: number | null
  active: boolean | null
  features: unknown
  variants: unknown
  animal: string | null
  weight: string | null
  sku: string | null
  box_units: number | null
}

function toArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  if (typeof v === 'string' && v.trim()) {
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? (parsed as T[]) : []
    } catch {
      return []
    }
  }
  return []
}

function mapRow(r: Row): Product {
  const animal: PetAnimal = r.animal === 'cat' ? 'cat' : 'dog'
  const v = getVisuals(r.category, animal)
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? '',
    longDescription: r.long_description ?? '',
    price: r.price,
    image: r.image ?? '',
    images: r.image ? [r.image] : [],
    category: r.category,
    animal,
    sku: r.sku ?? undefined,
    weight: r.weight ?? undefined,
    boxUnits: r.box_units ?? undefined,
    emoji: v.emoji,
    gradient: v.gradient,
    features: toArray<string>(r.features),
    variants: toArray<ProductVariant>(r.variants),
    access: r.access === 'members' ? 'members' : 'public',
    stock: r.stock ?? 0,
  }
}

// Solo productos activos, para la tienda pública.
export async function getProducts(): Promise<Product[]> {
  const { rows } = await pool.query<Row>(
    `SELECT * FROM products WHERE active = true ORDER BY category ASC, name ASC`,
  )
  return rows.map(mapRow)
}

export async function getProductsByAnimal(animal: PetAnimal): Promise<Product[]> {
  const { rows } = await pool.query<Row>(
    `SELECT * FROM products WHERE active = true AND animal = $1 ORDER BY name ASC`,
    [animal],
  )
  return rows.map(mapRow)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { rows } = await pool.query<Row>(`SELECT * FROM products WHERE slug = $1 LIMIT 1`, [slug])
  return rows[0] ? mapRow(rows[0]) : undefined
}
