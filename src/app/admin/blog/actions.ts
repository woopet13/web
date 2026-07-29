'use server'

import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

interface BlogPayload {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  published: boolean
}

export async function saveBlogPost(payload: BlogPayload) {
  if (!(await isAdmin())) return { error: 'No autorizado' }

  const { id, ...data } = payload
  const body = { ...data, updated_at: new Date().toISOString() }

  const { error } = id
    ? await db.from('blog_posts').update(body).eq('id', id)
    : await db.from('blog_posts').insert(body)

  if (error) return { error: error.message }
  return { ok: true }
}

export async function deleteBlogPost(id: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }

  const { error } = await db.from('blog_posts').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}
