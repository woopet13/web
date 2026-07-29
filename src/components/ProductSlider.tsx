'use client'

import { useRef } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Product } from '@/types'
import ProductCard from './ProductCard'

export default function ProductSlider({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Botones */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute -left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 text-[#155E5B] shadow-lg ring-1 ring-[#F3E0D5] transition hover:bg-[#F0846E] hover:text-white md:flex"
      >
        <CaretLeft weight="bold" size={20} />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Siguiente"
        className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 text-[#155E5B] shadow-lg ring-1 ring-[#F3E0D5] transition hover:bg-[#F0846E] hover:text-white md:flex"
      >
        <CaretRight weight="bold" size={20} />
      </button>

      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </div>
  )
}
