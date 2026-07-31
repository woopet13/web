import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarBlank, Tag } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import { marked } from 'marked'
import { formatBlogDate } from '@/lib/blog'
import { getPost } from '@/lib/blog-db'
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: DEFAULT_OG_IMAGE, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const htmlContent = await marked(post.content)

  return (
    <div className="bg-[#FFF6EE] min-h-screen">
      {/* Hero */}
      <div
        className="card-grad relative w-full h-64 md:h-80 flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
      >
        <span className="text-8xl drop-shadow-[0_10px_18px_rgba(0,0,0,0.2)]">{post.emoji}</span>
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors hover:bg-black/40"
          >
            <ArrowLeft weight="bold" size={14} /> Volver al blog
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 bg-[#F0846E]/15 text-[#F0846E]">
          {post.category}
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#155E5B] leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#2F7A77] mb-8 pb-8 border-b border-[#F3E0D5]">
          <span className="inline-flex items-center gap-1.5"><CalendarBlank weight="bold" size={14} />{formatBlogDate(post.date)}</span>
          <span className="inline-flex items-center gap-1.5"><Tag weight="bold" size={14} />{post.category}</span>
        </div>

        <p className="text-[#155E5B] text-lg leading-relaxed mb-8 font-semibold">{post.excerpt}</p>

        <article
          className="prose prose-stone max-w-none
            [&_h2]:font-display [&_h2]:text-[#155E5B] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:font-display [&_h3]:text-[#155E5B] [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:text-[#155E5B] [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:text-[#155E5B] [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:list-disc
            [&_ol]:text-[#155E5B] [&_ol]:pl-5 [&_ol]:mb-4
            [&_li]:mb-1.5
            [&_strong]:text-[#155E5B] [&_strong]:font-bold
            [&_a]:text-[#F0846E] [&_a]:underline [&_a]:underline-offset-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#F2A24E] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#2F7A77] [&_blockquote]:my-6"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-12 pt-8 border-t border-[#F3E0D5]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#F0846E] font-bold hover:text-[#E0654E] transition-colors">
            <ArrowLeft weight="bold" size={14} /> Ver todos los artículos
          </Link>
        </div>
      </div>
    </div>
  )
}
