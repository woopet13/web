'use server'

import { pool } from '@/lib/db'
import { isSuperAdmin, hashPassword, getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Crea un usuario del equipo (shop manager) que puede entrar al panel.
export async function createStaff(input: { name: string; email: string; password: string }) {
  if (!(await isSuperAdmin())) return { error: 'No autorizado' }

  const name = (input.name ?? '').trim()
  const email = (input.email ?? '').trim().toLowerCase()
  const password = input.password ?? ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Email inválido.' }
  if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' }

  try {
    const { rowCount } = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'manager')
       ON CONFLICT (email) DO NOTHING`,
      [email, hashPassword(password), name || null],
    )
    if (rowCount === 0) return { error: 'Ya existe un usuario con ese email.' }
    revalidatePath('/admin/usuarios')
    return { ok: true }
  } catch {
    return { error: 'No se pudo crear el usuario.' }
  }
}

// Elimina un manager. No permite borrar admins ni a sí mismo.
export async function deleteStaff(id: string) {
  if (!(await isSuperAdmin())) return { error: 'No autorizado' }
  const me = await getSessionUser()
  if (me?.id === id) return { error: 'No puedes eliminarte a ti mismo.' }
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM users WHERE id = $1 AND role = 'manager'`, [id],
    )
    if (rowCount === 0) return { error: 'Solo se pueden eliminar usuarios tipo manager.' }
    revalidatePath('/admin/usuarios')
    return { ok: true }
  } catch {
    return { error: 'No se pudo eliminar el usuario.' }
  }
}

// Cambia la contraseña de un manager.
export async function resetStaffPassword(id: string, password: string) {
  if (!(await isSuperAdmin())) return { error: 'No autorizado' }
  if ((password ?? '').length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  try {
    const { rowCount } = await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2 AND role = 'manager'`,
      [hashPassword(password), id],
    )
    if (rowCount === 0) return { error: 'Solo se puede cambiar la clave de un manager.' }
    return { ok: true }
  } catch {
    return { error: 'No se pudo actualizar la contraseña.' }
  }
}
