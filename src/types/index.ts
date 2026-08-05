export interface ProductVariant {
  id: string
  label: string
  price: number
}

export type PetAnimal = 'dog' | 'cat'

export interface Product {
  id: string
  name: string
  description: string
  longDescription?: string
  price: number
  image: string
  images?: string[]
  category: string
  /** Para qué mascota es el producto */
  animal: PetAnimal
  /** SKU del catálogo */
  sku?: string
  /** Peso / presentación, p.ej. "100 g" */
  weight?: string
  /** Emoji representativo para las cards sin foto */
  emoji?: string
  /** Gradiente doble [from, to] para la card */
  gradient?: [string, string]
  access: 'public' | 'members'
  stock: number
  /** Umbral de stock crítico: avisa cuando stock <= este valor */
  lowStockThreshold?: number
  slug: string
  features?: string[]
  variants?: ProductVariant[]
  /** Se vende por caja de N unidades */
  boxUnits?: number
}

export interface CartItem extends Product {
  quantity: number
  selectedVariant?: ProductVariant
}
