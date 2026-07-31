import 'server-only'
import { pool } from './db'

export type Animal = 'dog' | 'cat'

export interface Category {
  name: string
  animal: Animal
}

export interface CategoryInfo extends Category {
  /** Cantidad de productos que usan esta subcategoría (para esa mascota) */
  count: number
}

// Subcategorías (name + mascota padre) para selects del admin y del editor.
export async function getCategories(): Promise<Category[]> {
  const { rows } = await pool.query<Category>(
    `SELECT name, animal FROM categories
      WHERE animal IN ('dog', 'cat')
      ORDER BY animal ASC, name ASC`,
  )
  return rows
}

// Subcategorías con la cantidad de productos asociados (para el panel admin).
export async function getCategoriesWithCount(): Promise<CategoryInfo[]> {
  const { rows } = await pool.query<CategoryInfo>(
    `SELECT c.name, c.animal, COUNT(p.id)::int AS count
       FROM categories c
       LEFT JOIN products p ON p.category = c.name AND p.animal = c.animal
      WHERE c.animal IN ('dog', 'cat')
      GROUP BY c.name, c.animal
      ORDER BY c.animal ASC, c.name ASC`,
  )
  return rows
}
