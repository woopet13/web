'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeSlash, EnvelopeSimple, Lock } from '@phosphor-icons/react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos.')
    } else {
      const params = new URLSearchParams(window.location.search)
      const next = params.get('next')
      const role = data.user?.role
      const staff = role === 'admin' || role === 'manager' || data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
      router.push(next ?? (staff ? '/admin' : '/productos'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/paw.svg" alt="Woopet" width={72} height={72} className="mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-[#155E5B]">Iniciar sesión</h1>
          <p className="text-[#2F7A77] mt-2 text-sm">Accede a tu cuenta de Woopet 🐾</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 border border-[#F3E0D5]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#155E5B] mb-2">Email</label>
            <div className="relative">
              <EnvelopeSimple weight="fill" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2A24E]" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-[#F3E0D5] rounded-xl pl-10 pr-4 py-3 text-[#155E5B] focus:outline-none focus:border-[#F0846E] focus:ring-2 focus:ring-[#F0846E]/20 transition-colors bg-[#FFFBF7]"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#155E5B] mb-2">Contraseña</label>
            <div className="relative">
              <Lock weight="fill" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2A24E]" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-[#F3E0D5] rounded-xl pl-10 pr-12 py-3 text-[#155E5B] focus:outline-none focus:border-[#F0846E] focus:ring-2 focus:ring-[#F0846E]/20 transition-colors bg-[#FFFBF7]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F7A77] hover:text-[#155E5B]"
              >
                {showPass ? <EyeSlash weight="fill" size={18} /> : <Eye weight="fill" size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F0846E] text-white py-3 rounded-xl font-medium hover:bg-[#E0654E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-center text-sm text-[#2F7A77] mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[#F0846E] font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
