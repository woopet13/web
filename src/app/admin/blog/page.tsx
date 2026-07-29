import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { PlusCircle, PencilSimple } from '@phosphor-icons/react/dist/ssr'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, published, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#155E5B]">Blog</h1>
          <p className="text-[#2F7A77] mt-1">{posts?.length ?? 0} artículos en total</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex items-center gap-2 bg-[#155E5B] text-[#FFF6EE] px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#2F7A77] transition-colors"
        >
          <PlusCircle weight="fill" size={18} />
          Nuevo post
        </Link>
      </div>

      {!posts?.length ? (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-16 text-center">
          <p className="text-[#2F7A77] mb-4">No hay artículos aún.</p>
          <Link
            href="/admin/blog/nuevo"
            className="inline-flex items-center gap-2 bg-[#155E5B] text-[#FFF6EE] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2F7A77] transition-colors"
          >
            <PlusCircle weight="fill" size={16} />
            Crear primer artículo
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FFF6EE] border-b border-[#F3E0D5]">
                <th className="text-left px-5 py-3 font-semibold text-[#155E5B]">Título</th>
                <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Categoría</th>
                <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-[#F3E0D5] last:border-0 hover:bg-[#FFF1E8] transition-colors">
                  <td className="px-5 py-4 font-medium text-[#155E5B]">{post.title}</td>
                  <td className="px-4 py-4 text-[#2F7A77]">{post.category}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                      post.published
                        ? 'bg-[#4FB0AB]/20 text-[#4FB0AB]'
                        : 'bg-[#F2A24E]/20 text-[#F2A24E]'
                    }`}>
                      {post.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#2F7A77]">
                    {new Date(post.created_at).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#F2A24E] hover:underline font-medium"
                    >
                      <PencilSimple weight="bold" size={13} />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
