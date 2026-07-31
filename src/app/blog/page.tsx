import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, PawPrint } from '@phosphor-icons/react/dist/ssr'
import { formatBlogDate } from '@/lib/blog'
import { getPosts } from '@/lib/blog-db'

export const metadata = {
  title: 'Blog',
  description: 'Consejos de nutrición, cuidados y snacks para perros y gatos.',
  alternates: { canonical: '/blog' },
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <div className="bg-[#FFF6EE] min-h-screen">
      {/* Header */}
      <section className="relative bg-[#155E5B] text-[#FFF6EE] py-20 px-4 text-center overflow-hidden">
        <Image src="/images/hero/hero-blog.jpg" alt="" fill priority sizes="100vw" className="object-cover hero-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#155E5B]/90 via-[#0F4644]/85 to-[#2F7A77]/90" />
        <div className="paw-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10">
          <p className="text-[#F2A24E] text-xs font-bold tracking-[0.3em] uppercase mb-4">Consejos para tu mascota</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Blog de Woopet 🐾</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Nutrición, cuidados y todo lo que necesitas para consentir a tu perro o gato.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-3xl ring-1 ring-[#F3E0D5] overflow-hidden shadow-sm hover:shadow-lg transition-shadow group card-lift"
            >
              <div
                className="card-grad relative h-40 flex items-center justify-center"
                style={{ backgroundImage: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
              >
                <span className="text-6xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)] transition-transform group-hover:scale-110">{post.emoji}</span>
                <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-[#155E5B]">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[#2F7A77] text-xs mb-2">{formatBlogDate(post.date)}</p>
                <h2 className="font-display font-bold text-[#155E5B] text-lg mb-2 leading-snug group-hover:text-[#F0846E] transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-[#2F7A77] text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-xs text-[#F0846E] font-bold">
                  Leer artículo <ArrowRight weight="bold" size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="rounded-3xl bg-white ring-1 ring-[#F3E0D5] p-8 shadow-sm">
          <PawPrint weight="fill" size={32} className="text-[#F0846E] mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-[#155E5B] mb-2">¿Listo para consentir a tu mascota?</h2>
          <p className="text-[#2F7A77] text-sm mb-5">Explora nuestro catálogo de snacks, alimento y más.</p>
          <Link href="/productos" className="inline-flex items-center gap-2 rounded-full bg-[#F0846E] px-7 py-3 text-sm font-bold text-white hover:bg-[#E0654E] transition-colors">
            Ir a la tienda <ArrowRight weight="bold" size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}
