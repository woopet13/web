'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Dog, Cat, PawPrint } from '@phosphor-icons/react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { CATEGORIES } from '@/lib/products'

type AnimalFilter = 'all' | 'dog' | 'cat'

const ANIMALS: { key: AnimalFilter; label: string; Icon: any }[] = [
  { key: 'all', label: 'Todos', Icon: PawPrint },
  { key: 'dog', label: 'Perros', Icon: Dog },
  { key: 'cat', label: 'Gatos', Icon: Cat },
]

export default function ProductsClient({
  allProducts,
  initialAnimal = 'all',
}: {
  allProducts: Product[]
  initialAnimal?: AnimalFilter
}) {
  const [animal, setAnimal] = useState<AnimalFilter>(initialAnimal)
  const [category, setCategory] = useState<string>('Todas')

  const filtered = allProducts.filter(
    p => (animal === 'all' || p.animal === animal) && (category === 'Todas' || p.category === category),
  )

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#155E5B] px-4 py-20 text-center text-[#FFF6EE]">
        <Image src="/images/hero/hero-productos.jpg" alt="" fill priority sizes="100vw" className="object-cover hero-kenburns-alt" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#155E5B]/90 via-[#0F4644]/85 to-[#2F7A77]/90" />
        <div className="paw-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#F2A24E]">Woopet Pet Shop</p>
          <h1 className="font-display text-4xl font-extrabold md:text-6xl">Nuestros productos 🐾</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Snacks, alimento completo y arena para consentir a tu mejor amigo. Marcas premium Wanpy y Cateko.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Filtro por mascota */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {ANIMALS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setAnimal(key)}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all ${
                animal === key
                  ? 'scale-105 bg-[#F0846E] text-white'
                  : 'bg-white text-[#155E5B] ring-1 ring-[#F3E0D5] hover:ring-[#F0846E]'
              }`}
            >
              <Icon weight="fill" size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Filtro por categoría */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {['Todas', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                category === cat
                  ? 'bg-[#155E5B] text-[#FFF6EE]'
                  : 'bg-white text-[#2F7A77] ring-1 ring-[#F3E0D5] hover:ring-[#155E5B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="mb-6 text-center text-sm font-semibold text-[#2F7A77]">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[#2F7A77]">No hay productos con estos filtros.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
