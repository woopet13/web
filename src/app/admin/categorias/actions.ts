'use server'

import { pool } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type Animal = 'dog' | 'cat'

function validAnimal(a: string): a is Animal {
  return a === 'dog' || a === 'cat'
}

export async function createCategory(name: string, animal: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  if (!validAnimal(animal)) return { error: 'Elige la mascota (Perros o Gatos).' }
  const clean = (name ?? '').trim()
  if (!clean) return { error: 'Escribe un nombre para la subcategoría.' }
  if (clean.length > 60) return { error: 'El nombre es demasiado largo.' }

  try {
    const { rowCount } = await pool.query(
      `INSERT INTO categories (name, animal) VALUES ($1, $2)
       ON CONFLICT (name, animal) DO NOTHING`,
      [clean, animal],
    )
    if (rowCount === 0) return { error: 'Esa subcategoría ya existe para esa mascota.' }
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/productos')
    revalidatePath('/productos')
    return { ok: true }
  } catch {
    return { error: 'No se pudo crear la subcategoría.' }
  }
}

export async function renameCategory(oldName: string, animal: string, newName: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  if (!validAnimal(animal)) return { error: 'Mascota inválida.' }
  const clean = (newName ?? '').trim()
  if (!clean) return { error: 'Escribe un nombre válido.' }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `UPDATE categories SET name = $1 WHERE name = $2 AND animal = $3`,
      [clean, oldName, animal],
    )
    // Mantiene sincronizados los productos de esa mascota que la usan.
    await client.query(
      `UPDATE products SET category = $1 WHERE category = $2 AND animal = $3`,
      [clean, oldName, animal],
    )
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

export async function deleteCategory(name: string, animal: string) {
  if (!(await isAdmin())) return { error: 'No autorizado' }
  if (!validAnimal(animal)) return { error: 'Mascota inválida.' }
  try {
    const { rows } = await pool.query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM products WHERE category = $1 AND animal = $2`,
      [name, animal],
    )
    if ((rows[0]?.count ?? 0) > 0) {
      return { error: `No se puede eliminar: ${rows[0].count} producto(s) usan esta subcategoría.` }
    }
    await pool.query(`DELETE FROM categories WHERE name = $1 AND animal = $2`, [name, animal])
    revalidatePath('/admin/categorias')
    revalidatePath('/admin/productos')
    revalidatePath('/productos')
    return { ok: true }
  } catch {
    return { error: 'No se pudo eliminar la subcategoría.' }
  }
}
