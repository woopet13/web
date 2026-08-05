'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
  ShieldCheck, ArrowLeft, ShoppingCartSimple, CheckCircle, WhatsappLogo, Dog, Cat, Truck, PawPrint,
} from '@phosphor-icons/react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ProductCard'

export default function ProductDetail({ product, related = [] }: { product: Product; related?: Product[] }) {
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  const [from, to] = product.gradient ?? ['#3FA9A2', '#F0846E']
  const AnimalIcon = product.animal === 'dog' ? Dog : Cat

  const waText = encodeURIComponent(
    `¡Hola Woopet! Me interesa ${product.name} (${product.sku ?? ''}). ¿Me ayudan con mi pedido? 🐾`,
  )
  const waUrl = `https://wa.me/56984197351?text=${waText}`

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-[#2F7A77]">
        <Link href="/" className="transition-colors hover:text-[#F0846E]">Inicio</Link>
        <span>/</span>
        <Link href="/productos" className="transition-colors hover:text-[#F0846E]">Productos</Link>
        <span>/</span>
        <span className="font-semibold text-[#155E5B]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card-grad relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] shadow-xl"
          style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
        >
          <span className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/15" />
          <span className="absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-white/10" />
          {product.image ? (
            <motion.div
              className="relative h-[78%] w-[78%]"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 90vw, 500px"
                className="object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
                priority
              />
            </motion.div>
          ) : (
            <motion.span
              className="relative text-[11rem] drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {product.emoji ?? '🐾'}
            </motion.span>
          )}
          <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-[#155E5B] shadow">
            <AnimalIcon weight="fill" size={16} /> {product.animal === 'dog' ? 'Perros' : 'Gatos'}
          </span>
        </motion.div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#155E5B] px-3 py-1 text-xs font-bold text-white">{product.category}</span>
            {product.weight && (
              <span className="rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-semibold text-[#2F7A77] ring-1 ring-[#F3E0D5]">{product.weight}</span>
            )}
            {product.sku && (
              <span className="rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-semibold text-[#2F7A77] ring-1 ring-[#F3E0D5]">SKU {product.sku}</span>
            )}
          </div>

          <h1 className="mb-4 font-display text-3xl font-extrabold leading-tight text-[#155E5B] md:text-4xl">
            {product.name}
          </h1>

          <div className="mb-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-[#F0846E]">{formatPrice(product.price)}</span>
            {product.boxUnits && <span className="text-sm font-semibold text-[#2F7A77]">/ caja de {product.boxUnits} u.</span>}
          </div>

          <p className="mb-6 text-base leading-relaxed text-[#155E5B]">
            {product.longDescription || product.description}
          </p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-2">
              {product.features.map(f => (
                <div key={f} className="flex items-center gap-2 rounded-xl bg-[#FFF6EE] px-3 py-2 ring-1 ring-[#F3E0D5]">
                  <ShieldCheck weight="fill" size={15} className="shrink-0 text-[#4FB0AB]" />
                  <span className="text-xs font-semibold text-[#155E5B]">{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Cantidad */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-[#155E5B]">Cantidad</span>
            <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#F3E0D5]">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-7 w-7 rounded-full text-lg font-bold text-[#155E5B] hover:bg-[#FFF1E8]">−</button>
              <span className="w-6 text-center font-bold text-[#155E5B]">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="h-7 w-7 rounded-full text-lg font-bold text-[#155E5B] hover:bg-[#FFF1E8]">+</button>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.98 }}
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F0846E] py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-[#E0654E]"
          >
            {added
              ? <><CheckCircle weight="fill" size={24} /> ¡Agregado al carrito!</>
              : <><ShoppingCartSimple weight="fill" size={24} /> Agregar al carrito</>}
          </motion.button>
          {added && (
            <Link href="/carrito" className="mb-2 flex w-full items-center justify-center text-sm font-semibold text-[#F0846E] hover:underline">
              Ir al carrito →
            </Link>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] py-3.5 text-base font-bold text-white shadow-md transition-colors hover:bg-[#1EBE5D]"
          >
            <WhatsappLogo weight="fill" size={22} />
            Consultar por WhatsApp
          </a>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#FFF6EE] px-4 py-3 text-sm text-[#2F7A77] ring-1 ring-[#F3E0D5]">
            <Truck weight="fill" size={18} className="text-[#4FB0AB]" />
            Despacho a todo Chile · Retiro en tienda disponible
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-2">
            <PawPrint weight="fill" size={22} className="text-[#F0846E]" />
            <h2 className="font-display text-2xl font-bold text-[#155E5B]">También te puede gustar</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link href="/productos" className="flex items-center gap-2 font-semibold text-[#F0846E] transition-colors hover:text-[#E0654E]">
          <ArrowLeft weight="bold" size={18} />
          Volver a productos
        </Link>
      </div>
    </div>
  )
}
