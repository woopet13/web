'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Basket, List, X, SignOut, Storefront, House, ChatCircle, Heart } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { createClient, type AppUser } from '@/lib/supabase'

const NAV = [
  { href: '/', label: 'Inicio', Icon: House },
  { href: '/productos', label: 'Productos', Icon: Storefront },
  { href: '/nosotros', label: 'Nosotros', Icon: Heart },
  { href: '/contacto', label: 'Contacto', Icon: ChatCircle },
]

export default function Navbar() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="bg-[#155E5B] text-[#FFF6EE] sticky top-0 z-50 shadow-lg" style={{ viewTransitionName: 'site-header' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Woopet */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.jpeg"
            alt="Woopet Pet Shop"
            width={56}
            height={56}
            priority
            className="h-14 w-14 rounded-2xl object-cover shadow-md transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={label} href={href} className="flex items-center gap-1.5 hover:text-[#F2A24E] transition-colors text-sm font-semibold">
              <Icon weight="fill" size={17} />{label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/carrito" className="relative p-2 hover:text-[#F2A24E] transition-colors">
            <Basket weight="fill" size={24} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F0846E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce-soft">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-[#F2A24E] max-w-[120px] truncate">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs border border-[#F2A24E] px-3 py-1.5 rounded-full hover:bg-[#F2A24E] hover:text-[#155E5B] transition-colors"
              >
                <SignOut weight="bold" size={14} />
                Salir
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-sm font-semibold hover:text-[#F2A24E] transition-colors">
                Ingresar
              </Link>
              <Link href="/registro" className="bg-[#F0846E] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#E0654E] transition-colors shadow-sm">
                Registrarse
              </Link>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            {menuOpen ? <X weight="bold" size={22} /> : <List weight="bold" size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0F4644] px-4 pb-4 flex flex-col gap-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={label} href={href} className="flex items-center gap-2 py-2.5 border-b border-[#2F7A77] hover:text-[#F2A24E]" onClick={() => setMenuOpen(false)}>
              <Icon weight="fill" size={17} />{label}
            </Link>
          ))}
          {user ? (
            <>
              <span className="text-xs text-[#F2A24E] pt-2">{user.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-left py-2 hover:text-[#F2A24E]">
                <SignOut weight="bold" size={16} />Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-3">
              <Link href="/login" className="flex-1 text-center py-2 rounded-full border border-[#F2A24E] hover:bg-[#F2A24E] hover:text-[#155E5B]" onClick={() => setMenuOpen(false)}>Ingresar</Link>
              <Link href="/registro" className="flex-1 text-center py-2 rounded-full bg-[#F0846E] text-white hover:bg-[#E0654E]" onClick={() => setMenuOpen(false)}>Registrarse</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
