import Link from 'next/link'
import Image from 'next/image'
import { Heart, Truck, ShieldCheck, PawPrint, Storefront, Leaf } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Nosotros | Woopet Pet Shop',
  description: 'Conoce Woopet: un pet shop chileno hecho por y para amantes de los animales.',
}

const values = [
  { Icon: Heart, title: 'Amor por los animales', text: 'Cada producto lo elegimos pensando en la salud y felicidad de tu mascota.' },
  { Icon: ShieldCheck, title: 'Calidad premium', text: 'Trabajamos con marcas certificadas como Wanpy y Cateko.' },
  { Icon: Truck, title: 'Despacho a todo Chile', text: 'Llevamos los mejores snacks y alimentos hasta la puerta de tu casa.' },
  { Icon: Leaf, title: 'Opciones responsables', text: 'Snacks grain-free y arena ecológica biodegradable.' },
]

const stats = [
  { n: '38+', label: 'productos' },
  { n: '2', label: 'marcas premium' },
  { n: '100%', label: 'amor por las mascotas' },
]

export default function NosotrosPage() {
  return (
    <div className="bg-[#FFF6EE] min-h-screen">
      {/* Hero */}
      <section className="relative bg-[#155E5B] text-[#FFF6EE] py-24 px-4 text-center overflow-hidden">
        <Image src="/images/hero/hero-nosotros.jpg" alt="" fill priority sizes="100vw" className="object-cover hero-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#155E5B]/90 via-[#0F4644]/85 to-[#2F7A77]/90" />
        <div className="paw-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10">
          <div className="text-6xl mb-4">🐶🐱</div>
          <p className="text-[#F2A24E] text-xs font-bold tracking-[0.3em] uppercase mb-4">Sobre nosotros</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Somos Woopet</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
            Un pet shop chileno hecho por amantes de los animales, para amantes de los animales.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F0846E] shadow-sm mb-5">
          <PawPrint weight="fill" size={14} /> Nuestra historia
        </span>
        <h2 className="font-display text-3xl font-extrabold text-[#155E5B] mb-4">
          Todo empezó por <span className="gradient-text">amor</span> a las mascotas
        </h2>
        <p className="text-[#2F7A77] leading-relaxed">
          Woopet nació con una idea simple: que consentir a tu perro o gato sea fácil, accesible y confiable.
          Seleccionamos snacks, alimento completo y arena de las mejores marcas, y los llevamos a todo Chile
          con el cariño que tu mascota merece. Porque para nosotros, no son solo mascotas: son familia.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-3xl bg-gradient-to-br from-[#155E5B] to-[#3FA9A2] p-6 text-center text-white shadow-md">
              <p className="font-display text-3xl md:text-4xl font-extrabold">{s.n}</p>
              <p className="text-xs text-white/80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, title, text }) => (
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

      {/* CTA */}
      <section className="relative mx-4 mb-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#F0846E] to-[#F2A24E] px-6 py-14 text-center text-white md:mx-auto md:max-w-5xl">
        <div className="paw-pattern absolute inset-0 opacity-20" />
        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold">¿Listo para consentir a tu mascota?</h2>
          <Link href="/productos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#155E5B] shadow-lg transition-transform hover:scale-105">
            <Storefront weight="fill" size={18} /> Ver la tienda
          </Link>
        </div>
      </section>
    </div>
  )
}
