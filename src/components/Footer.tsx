import Link from 'next/link'
import Image from 'next/image'
import { InstagramLogo, WhatsappLogo, EnvelopeSimple, Truck } from '@phosphor-icons/react/dist/ssr'

export default function Footer() {
  return (
    <footer className="bg-[#155E5B] text-[#FFF6EE]">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="mb-4 inline-flex">
            <Image
              src="/logo.jpeg"
              alt="Woopet Pet Shop"
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-cover shadow-md"
            />
          </Link>
          <p className="text-[#FFF6EE]/80 text-sm leading-relaxed mb-3 max-w-sm">
            Tu pet shop online favorito. Snacks, alimento completo y arena ecológica para perros y gatos, con las mejores marcas y despacho a todo Chile.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#F2A24E] transition-colors hover:text-[#FFF6EE]">
              <InstagramLogo weight="fill" size={16} /> @woopet
            </a>
            <span className="text-[#FFF6EE]/40">·</span>
            <a href="mailto:hola@woopet.cl" className="flex items-center gap-1.5 text-[#F2A24E] transition-colors hover:text-[#FFF6EE]">
              <EnvelopeSimple weight="fill" size={16} /> hola@woopet.cl
            </a>
            <span className="text-[#FFF6EE]/40">·</span>
            <a href="https://wa.me/56940547049" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#F2A24E] transition-colors hover:text-[#FFF6EE]">
              <WhatsappLogo weight="fill" size={16} /> +56 9 4054 7049
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-[#FFF6EE]/70">
            <Truck weight="fill" size={15} className="text-[#7FD1CB]" /> Despacho a todo Chile · Retiro en tienda
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4 text-[#F2A24E]">Tienda</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/productos" className="hover:text-[#F2A24E] transition-colors">Todos los productos</Link></li>
            <li><Link href="/productos?animal=dog" className="hover:text-[#F2A24E] transition-colors">Para perros 🐶</Link></li>
            <li><Link href="/productos?animal=cat" className="hover:text-[#F2A24E] transition-colors">Para gatos 🐱</Link></li>
            <li><Link href="/carrito" className="hover:text-[#F2A24E] transition-colors">Mi carrito</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4 text-[#F2A24E]">Woopet</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/nosotros" className="hover:text-[#F2A24E] transition-colors">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-[#F2A24E] transition-colors">Contacto</Link></li>
            <li><Link href="/blog" className="hover:text-[#F2A24E] transition-colors">Blog</Link></li>
            <li><Link href="/terminos" className="hover:text-[#F2A24E] transition-colors">Términos y condiciones</Link></li>
            <li><Link href="/legalidad" className="hover:text-[#F2A24E] transition-colors">Legalidad</Link></li>
          </ul>
          <p className="text-xs mt-6 text-[#FFF6EE]/70">
            © {new Date().getFullYear()} Woopet · Pet Shop Online · Chile
          </p>
        </div>
      </div>
    </footer>
  )
}
