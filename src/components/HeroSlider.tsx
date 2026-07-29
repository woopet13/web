'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { PawPrint, ArrowRight, Storefront } from '@phosphor-icons/react'

const slides = [
  {
    emoji: '🐶',
    side: ['🦴', '🐾', '🥎'],
    kicker: 'Snacks & Premios',
    title: 'Consiente a tu perro',
    text: 'Jerky, pastas cremosas y huesitos dentales Wanpy. Ricos en proteína y bajos en grasa.',
    href: '/productos?animal=dog',
    cta: 'Ver productos para perros',
  },
  {
    emoji: '🐱',
    side: ['🐟', '🍦', '🐾'],
    kicker: 'Creamys & Snacks',
    title: 'Engríe a tu gato',
    text: 'Cremosos de atún, salmón y pollo, y arena ecológica Cateko biodegradable.',
    href: '/productos?animal=cat',
    cta: 'Ver productos para gatos',
  },
  {
    emoji: '🏠',
    side: ['🐶', '🐱', '❤️'],
    kicker: 'Woopet Pet Shop',
    title: 'Todo para tu mascota',
    text: 'Alimento completo grain-free, snacks premium y más. Despacho a todo Chile.',
    href: '/productos',
    cta: 'Explorar la tienda',
  },
]

const INTERVAL = 5500

export default function HeroSlider() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % slides.length), INTERVAL)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#155E5B]">
      {/* Video de fondo: loop silenciado y liviano (~625 KB), con poster para
          mostrar algo al instante y como fallback si el video no carga. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero/hero-video-poster.jpg"
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Overlays de marca para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#155E5B]/80 via-[#0F4644]/70 to-[#2F7A77]/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/35" />
      <div className="paw-pattern absolute inset-0 opacity-20" />

      {/* Texto rotante + emojis, apilados y con crossfade sobre el video */}
      {slides.map((s, idx) => {
        const active = i === idx
        return (
          <motion.div
            key={idx}
            aria-hidden={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ pointerEvents: active ? 'auto' : 'none' }}
          >
            {/* Emojis flotantes laterales */}
            {s.side.map((e, sideIdx) => (
              <motion.span
                key={e + sideIdx}
                className="pointer-events-none absolute hidden text-5xl md:block lg:text-6xl"
                style={{
                  top: `${20 + sideIdx * 24}%`,
                  right: sideIdx % 2 === 0 ? `${6 + sideIdx * 4}%` : 'auto',
                  left: sideIdx % 2 === 1 ? `${5 + sideIdx * 3}%` : 'auto',
                }}
                animate={{ y: [0, -18, 0], rotate: [-6, 6, -6] }}
                transition={{ duration: 4 + sideIdx, repeat: Infinity, ease: 'easeInOut' }}
              >
                {e}
              </motion.span>
            ))}

            <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center text-white">
              <span className="mb-6 text-8xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] md:text-9xl">
                {s.emoji}
              </span>

              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
                <PawPrint weight="fill" size={14} /> {s.kicker}
              </span>

              <h1 className="font-display text-4xl font-extrabold leading-tight drop-shadow md:text-6xl">
                {s.title}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">{s.text}</p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={s.href}
                  className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#155E5B] shadow-lg transition-transform hover:scale-105"
                >
                  <Storefront weight="fill" size={18} /> {s.cta}
                </Link>
                <Link
                  href="/productos"
                  className="flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15"
                >
                  Todos los productos <ArrowRight weight="bold" size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </section>
  )
}
