'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const messages = [
  '¡Guau! ¿Ya viste los snacks nuevos? 🦴',
  '¡Miau! Mis creamys favoritos están aquí 🐟',
  'Envío a todo Chile 🚚',
  '¡Premia a tu mascota hoy! 🐾',
  'Alimento grain-free premium 🌾🚫',
]

export default function PetWidget() {
  const [msg, setMsg] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsg(m => (m + 1) % messages.length), 3200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative mx-auto flex max-w-md items-end justify-center gap-2">
      {/* Perro */}
      <motion.span
        className="text-7xl md:text-8xl"
        animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🐶
      </motion.span>

      {/* Burbuja */}
      <div className="relative mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={msg}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-[#155E5B] shadow-lg ring-1 ring-[#F3E0D5]"
          >
            {messages[msg]}
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gato */}
      <motion.span
        className="text-7xl md:text-8xl"
        animate={{ y: [0, -12, 0], rotate: [3, -3, 3] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        🐱
      </motion.span>
    </div>
  )
}
