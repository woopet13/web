import { redirect } from 'next/navigation'
import { pool } from '@/lib/db'
import { isSuperAdmin, getSessionUser } from '@/lib/auth'
import UsuariosManager, { type Staff } from './UsuariosManager'

export const dynamic = 'force-dynamic'

export default async function UsuariosPage() {
  if (!(await isSuperAdmin())) redirect('/admin')
  const me = await getSessionUser()

  const { rows } = await pool.query<Staff>(
    `SELECT id, email, full_name, role, created_at
       FROM users WHERE role IN ('admin', 'manager')
      ORDER BY (role = 'admin') DESC, created_at ASC`,
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#155E5B]">Usuarios</h1>
        <p className="text-[#2F7A77] mt-1">Equipo con acceso al panel. Crea usuarios (shop managers) para gestionar la tienda.</p>
      </div>
      <UsuariosManager staff={rows} meId={me?.id ?? ''} />
    </div>
  )
}
