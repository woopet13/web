import 'server-only'
import { pool } from './db'
import { getBlogVisuals, type BlogPost } from './blog'

interface Row {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  category: string | null
  published: boolean | null
  created_at: string | Date
}

function mapRow(r: Row): BlogPost {
  const category = r.category ?? 'General'
  const v = getBlogVisuals(category)
  const date = r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at)
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? '',
    category,
    emoji: v.emoji,
    gradient: v.gradient,
    date,
    content: r.content ?? '',
  }
}

// Solo publicados, para el blog público.
export async function getPosts(): Promise<BlogPost[]> {
  const { rows } = await pool.query<Row>(
    `SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC`,
  )
  return rows.map(mapRow)
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const { rows } = await pool.query<Row>(`SELECT * FROM blog_posts WHERE slug = $1 LIMIT 1`, [slug])
  return rows[0] ? mapRow(rows[0]) : undefined
}
