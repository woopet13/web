'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Check, Dog, Cat, ArrowRight } from '@phosphor-icons/react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/products'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [from, to] = product.gradient ?? ['#3FA9A2', '#F0846E']
  const soldOut = product.stock <= 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const AnimalIcon = product.animal === 'dog' ? Dog : Cat

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link
        href={`/productos/${product.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(21,94,91,0.08)] ring-1 ring-[#F3E0D5] transition-shadow duration-300 group-hover:shadow-[0_24px_48px_rgba(21,94,91,0.18)]"
      >
        {/* Cabecera con gradiente doble animado */}
        <div
          className="card-grad relative flex h-44 items-center justify-center overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
        >
          <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
          <span className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-white/10" />

          {product.image ? (
            <motion.div
              className="relative h-36 w-full"
              whileHover={{ scale: 1.08, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 80vw, 300px"
                className="object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.22)]"
              />
            </motion.div>
          ) : (
            <motion.span
              className="relative text-7xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
              whileHover={{ scale: 1.15, rotate: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {product.emoji ?? '🐾'}
            </motion.span>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#155E5B] shadow-sm backdrop-blur">
            {product.category}
          </span>
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#155E5B] shadow-sm">
            <AnimalIcon weight="fill" size={17} />
          </span>

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
              <span className="rounded-full bg-[#155E5B] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white shadow-md">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 font-display text-base font-bold leading-tight text-[#155E5B] transition-colors group-hover:text-[#F0846E]">
            {product.name}
          </h3>
          <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-[#2F7A77]">
            {product.description}
          </p>

          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {product.weight && (
              <span className="rounded-full bg-[#FFF1E8] px-2 py-0.5 text-[10px] font-semibold text-[#2F7A77] ring-1 ring-[#F3E0D5]">
                {product.weight}
              </span>
            )}
            {product.boxUnits && (
              <span className="rounded-full bg-[#FFF1E8] px-2 py-0.5 text-[10px] font-semibold text-[#2F7A77] ring-1 ring-[#F3E0D5]">
                Caja x{product.boxUnits}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-lg font-extrabold text-[#F0846E]">{formatPrice(product.price)}</span>

            {soldOut ? (
              <span className="flex items-center gap-1 rounded-full bg-[#F3E0D5] px-3 py-2 text-xs font-bold text-[#9a8578] cursor-not-allowed">
                Agotado
              </span>
            ) : (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.9 }}
                aria-label="Agregar al carrito"
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors ${
                  added ? 'bg-[#4FB0AB]' : 'bg-[#155E5B] hover:bg-[#0F4644]'
                }`}
              >
                {added ? (
                  <><Check weight="bold" size={14} /> Agregado</>
                ) : (
                  <><Plus weight="bold" size={14} /> Agregar</>
                )}
              </motion.button>
            )}
          </div>

          <span className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#2F7A77] opacity-0 transition-opacity group-hover:opacity-100">
            Ver detalle <ArrowRight weight="bold" size={11} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
