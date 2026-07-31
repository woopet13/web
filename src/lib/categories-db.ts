import 'server-only'
import { pool } from './db'

export interface CategoryInfo {
  name: string
  /** Cantidad de productos que usan esta categoría */
  count: number
}

// Nombres de categorías (para selects del admin y filtros).
export async function getCategories(): Promise<string[]> {
  const { rows } = await pool.query<{ name: string }>(
    `SELECT name FROM categories ORDER BY name ASC`,
  )
  return rows.map(r => r.name)
}

// Categorías con la cantidad de productos asociados (para el panel admin).
export async function getCategoriesWithCount(): Promise<CategoryInfo[]> {
  const { rows } = await pool.query<CategoryInfo>(
    `SELECT c.name, COUNT(p.id)::int AS count
       FROM categories c
       LEFT JOIN products p ON p.category = c.name
      GROUP BY c.name
      ORDER BY c.name ASC`,
  )
  return rows
}
