'use server'

import { pool } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createCategory(name: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  const clean = (name ?? '').trim()
  if (!clean) return { error: 'Escribe un nombre para la categoría.' }
  if (clean.length > 60) return { error: 'El nombre es demasiado largo.' }

  try {
    const { rowCount } = await pool.query(
      `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [clean],
    )
    if (rowCount === 0) return { error: 'Esa categoría ya existe.' }
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/productos')
    revalidatePath('/productos')
    return { ok: true }
  } catch {
    return { error: 'No se pudo crear la categoría.' }
  }
}

export async function renameCategory(oldName: string, newName: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  const clean = (newName ?? '').trim()
  if (!clean) return { error: 'Escribe un nombre válido.' }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`UPDATE categories SET name = $1 WHERE name = $2`, [clean, oldName])
    // Mantiene sincronizados los productos que la usan.
    await client.query(`UPDATE products SET category = $1 WHERE category = $2`, [clean, oldName])
    await client.query('COMMIT')
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/productos')
    revalidatePath('/productos')
    return { ok: true }
  } catch {
    await client.query('ROLLBACK')
    return { error: 'No se pudo renombrar (¿ya existe ese nombre?).' }
  } finally {
    client.release()
  }
}

export async function deleteCategory(name: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  try {
    const { rows } = await pool.query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM products WHERE category = $1`,
      [name],
    )
    if ((rows[0]?.count ?? 0) > 0) {
      return { error: `No se puede eliminar: ${rows[0].count} producto(s) usan esta categoría.` }
    }
    await pool.query(`DELETE FROM categories WHERE name = $1`, [name])
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/productos')
    revalidatePath('/productos')
    return { ok: true }
  } catch {
    return { error: 'No se pudo eliminar la categoría.' }
  }
}
