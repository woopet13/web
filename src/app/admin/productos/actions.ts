'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { isAdmin } from '@/lib/auth'

interface Variant { id: string; label: string; price: number }

interface ProductPayload {
  id?: string
  name: string; slug: string; description: string; long_description: string
  price: number; image: string; category: string; animal: string; weight: string
  access: string; stock: number; active: boolean
  features: string[]; variants: Variant[]
}

export async function saveProduct(payload: ProductPayload) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  const supabase = createAdminClient()
  const { id, ...data } = payload
  const body = { ...data, updated_at: new Date().toISOString() }

  const { error } = id
    ? await supabase.from('products').update(body).eq('id', id)
    : await supabase.from('products').insert(body)

  if (error) return { error: error.message }
  return { ok: true }
}

export async function deleteProduct(id: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}
