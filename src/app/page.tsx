import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, Truck, ShieldCheck, Heart, PawPrint, Dog, Cat, Storefront, Leaf, Star,
} from '@phosphor-icons/react/dist/ssr'
import { getProducts, getProductsByAnimal } from '@/lib/products-db'
import type { Product } from '@/types'
import HeroSlider from '@/components/HeroSlider'
import ProductSlider from '@/components/ProductSlider'
import PetWidget from '@/components/PetWidget'
import { SITE_URL, SITE_NAME, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const FEATURED_SLUGS = [
  'snack-perro-pollo-jerky', 'creamy-gato-atun', 'alimento-perro-adulto-pollo',
  'snack-gato-pollo-sushi', 'pasta-perro-pollo', 'arena-ecologica-cateko',
  'alimento-gato-adulto-salmon', 'snack-perro-vacuno-jerky',
]

const CATEGORY_TILES = [
  { label: 'Snacks & Jerky', emoji: '🦴', grad: 'from-[#F0846E] to-[#F2A24E]', href: '/productos' },
  { label: 'Pastas Cremosas', emoji: '🍦', grad: 'from-[#F0846E] to-[#F7A98E]', href: '/productos' },
  { label: 'Alimento Completo', emoji: '🐶', grad: 'from-[#155E5B] to-[#3FA9A2]', href: '/productos' },
  { label: 'Arena Ecológica', emoji: '🌿', grad: 'from-[#4FB0AB] to-[#9BD4A0]', href: '/productos?animal=cat' },
]

const BENEFITS = [
  { Icon: Truck, title: 'Envío a todo Chile', text: 'Despacho rápido y seguro a tu puerta.' },
  { Icon: ShieldCheck, title: 'Marcas premium', text: 'Wanpy y Cateko, calidad garantizada.' },
  { Icon: Heart, title: 'Hecho con amor', text: 'Productos pensados para el bienestar de tu mascota.' },
  { Icon: Leaf, title: 'Opciones eco', text: 'Arena biodegradable y snacks grain-free.' },
]

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [all, allDogs, allCats] = await Promise.all([
    getProducts(),
    getProductsByAnimal('dog'),
    getProductsByAnimal('cat'),
  ])
  const featured = FEATURED_SLUGS
    .map(s => all.find(p => p.slug === s))
    .filter(Boolean) as Product[]
  const dogs = allDogs.slice(0, 8)
  const cats = allCats.slice(0, 8)

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.jpeg'),
    description: 'Pet shop online en Chile: snacks, alimento y arena para perros y gatos.',
    sameAs: ['https://instagram.com'],
  }
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }

  return (
    <div className="overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <HeroSlider />

      {/* Franja de beneficios (marquee) */}
      <div className="bg-[#155E5B] py-3 text-[#FFF6EE]">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-sm font-bold">
            {['🚚 Envío a todo Chile', '🐾 Marcas premium Wanpy & Cateko', '❤️ Snacks ricos en proteína',
              '🌿 Arena ecológica biodegradable', '🦴 Grain-free', '🐱 Creamys irresistibles'].map((t, i) => (
              <span key={i} className="flex items-center gap-2">{t}<span className="text-[#F2A24E]">•</span></span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-sm font-bold" aria-hidden>
            {['🚚 Envío a todo Chile', '🐾 Marcas premium Wanpy & Cateko', '❤️ Snacks ricos en proteína',
              '🌿 Arena ecológica biodegradable', '🦴 Grain-free', '🐱 Creamys irresistibles'].map((t, i) => (
              <span key={i} className="flex items-center gap-2">{t}<span className="text-[#F2A24E]">•</span></span>
            ))}
          </div>
        </div>
      </div>

      {/* Perros / Gatos */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { Icon: Dog, label: 'Para Perros', emoji: '🐶', text: 'Snacks, jerky, pastas y alimento completo.', grad: 'from-[#155E5B] to-[#3FA9A2]', href: '/productos?animal=dog' },
            { Icon: Cat, label: 'Para Gatos', emoji: '🐱', text: 'Creamys, snacks, alimento y arena ecológica.', grad: 'from-[#E0654E] to-[#F2A24E]', href: '/productos?animal=cat' },
          ].map(c => (
            <Link
              key={c.label}
              href={c.href}
              className={`card-grad group relative flex items-center gap-5 overflow-hidden rounded-3xl bg-gradient-to-br ${c.grad} p-8 text-white shadow-lg transition-transform hover:-translate-y-1`}
              style={{ backgroundSize: '180% 180%' }}
            >
              <span className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
              <span className="text-6xl transition-transform group-hover:scale-110">{c.emoji}</span>
              <div className="relative">
                <h3 className="font-display text-2xl font-extrabold">{c.label}</h3>
                <p className="mt-1 max-w-xs text-sm text-white/85">{c.text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold">Explorar <ArrowRight weight="bold" size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Widget mascotas animadas */}
      <section className="relative bg-[#FFF1E8] py-16">
        <div className="dot-pattern absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F0846E] shadow-sm">
            <PawPrint weight="fill" size={14} /> Bienvenido a Woopet
          </span>
          <h2 className="font-display text-3xl font-extrabold text-[#155E5B] md:text-4xl">
            El pet shop que tu mascota <span className="gradient-text">ama</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[#2F7A77]">
            Todo lo que necesitan perros y gatos, en un solo lugar y con despacho a todo Chile.
          </p>
          <div className="mt-10">
            <PetWidget />
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHead kicker="Los más pedidos" title="Productos destacados 🌟" href="/productos" />
        <ProductSlider products={featured} />
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORY_TILES.map(t => (
            <Link
              key={t.label}
              href={t.href}
              className={`card-lift group flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br ${t.grad} p-6 text-center text-white shadow-md`}
            >
              <span className="text-5xl transition-transform group-hover:scale-110 group-hover:-rotate-6">{t.emoji}</span>
              <span className="font-display text-sm font-bold leading-tight">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Para perros */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead kicker="Woof woof" title="Para perros 🐶" href="/productos?animal=dog" />
        <ProductSlider products={dogs} />
      </section>

      {/* Para gatos */}
      <section className="bg-[#FFF1E8] py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead kicker="Miau miau" title="Para gatos 🐱" href="/productos?animal=cat" />
          <ProductSlider products={cats} />
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-[#F3E0D5] card-lift">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F0846E] to-[#F2A24E] text-white shadow">
                <Icon weight="fill" size={26} />
              </div>
              <h3 className="font-display text-lg font-bold text-[#155E5B]">{title}</h3>
              <p className="mt-1 text-sm text-[#2F7A77]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Marcas */}
      <section className="mx-auto max-w-4xl px-4 pb-16 text-center">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#2F7A77]">Trabajamos con</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { name: 'Wanpy', grad: 'from-[#F0846E] to-[#E0654E]' },
            { name: 'Cateko', grad: 'from-[#4FB0AB] to-[#155E5B]' },
          ].map(b => (
            <span key={b.name} className={`rounded-2xl bg-gradient-to-br ${b.grad} px-8 py-4 font-display text-2xl font-extrabold text-white shadow-md`}>
              {b.name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative mx-4 mb-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#155E5B] via-[#0F4644] to-[#2F7A77] px-6 py-16 text-center text-white md:mx-auto md:max-w-6xl">
        <div className="paw-pattern absolute inset-0 opacity-30" />
        <div className="relative">
          <span className="text-6xl">🐾</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">¿Listo para consentir a tu mascota?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">Explora el catálogo completo de Woopet y haz feliz a tu mejor amigo hoy mismo.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/productos" className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#155E5B] shadow-lg transition-transform hover:scale-105">
              <Storefront weight="fill" size={18} /> Ir a la tienda
            </Link>
            <Link href="/registro" className="flex items-center gap-2 rounded-full bg-[#F0846E] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#E0654E]">
              Crear cuenta <ArrowRight weight="bold" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHead({ kicker, title, href }: { kicker: string; title: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#F0846E]">
          <Star weight="fill" size={13} /> {kicker}
        </p>
        <h2 className="font-display text-3xl font-extrabold text-[#155E5B]">{title}</h2>
      </div>
      <Link href={href} className="hidden shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#155E5B] shadow-sm ring-1 ring-[#F3E0D5] transition hover:bg-[#F0846E] hover:text-white sm:flex">
        Ver todos <ArrowRight weight="bold" size={14} />
      </Link>
    </div>
  )
}
