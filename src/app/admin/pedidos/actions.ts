'use server'

import { db } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const ALLOWED = ['pending', 'processing', 'completed', 'cancelled'] as const
type Status = (typeof ALLOWED)[number]

export async function updateOrderStatus(id: string, status: Status) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  if (!ALLOWED.includes(status)) return { error: 'Estado inválido' }

  const { error } = await db
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/pedidos')
  return { ok: true }
}
