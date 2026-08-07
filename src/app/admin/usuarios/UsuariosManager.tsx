'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Trash, Key, ShieldStar, User } from '@phosphor-icons/react'
import { createStaff, deleteStaff, resetStaffPassword } from './actions'

export interface Staff {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'manager'
  created_at: string
}

export default function UsuariosManager({ staff, meId }: { staff: Staff[]; meId: string }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setOk(''); setSaving(true)
    const res = await createStaff(form)
    setSaving(false)
    if (res.error) { setError(res.error); return }
    setOk(`Usuario ${form.email} creado.`)
    setForm({ name: '', email: '', password: '' })
    router.refresh()
  }

  async function remove(s: Staff) {
    if (!confirm(`¿Eliminar a ${s.email}?`)) return
    const res = await deleteStaff(s.id)
    if (res.error) { setError(res.error); return }
    router.refresh()
  }

  async function resetPass(s: Staff) {
    const pass = prompt(`Nueva contraseña para ${s.email} (mín. 6 caracteres):`)
    if (!pass) return
    const res = await resetStaffPassword(s.id, pass)
    if (res.error) { setError(res.error); return }
    setError(''); setOk(`Contraseña de ${s.email} actualizada.`)
  }

  return (
    <div className="max-w-2xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}
      {ok && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">{ok}</div>}

      {/* Crear */}
      <form onSubmit={add} className="bg-white rounded-2xl border border-[#F3E0D5] shadow-sm p-6 mb-8">
        <h2 className="font-display font-bold text-[#155E5B] text-lg mb-4 flex items-center gap-2">
          <UserPlus weight="fill" size={20} className="text-[#F0846E]" /> Nuevo usuario (shop manager)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre"
            className="border border-[#F3E0D5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
          />
          <input
            type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="email@woopet.cl" required
            className="border border-[#F3E0D5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
          />
          <input
            type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Contraseña (mín. 6)" required minLength={6}
            className="border border-[#F3E0D5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
          />
        </div>
        <button
          type="submit" disabled={saving}
          className="mt-4 bg-[#155E5B] text-[#FFF6EE] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#2F7A77] transition-colors disabled:opacity-50"
        >
          {saving ? 'Creando…' : 'Crear usuario'}
        </button>
        <p className="text-xs text-[#2F7A77] mt-3">
          Los managers pueden gestionar productos, pedidos, categorías, clientes y blog. No ven Finanzas ni la gestión de usuarios.
        </p>
      </form>

      {/* Lista */}
      <ul className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm divide-y divide-[#F3E0D5]">
        {staff.map(s => (
          <li key={s.id} className="flex items-center gap-3 px-5 py-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${s.role === 'admin' ? 'bg-[#F2A24E]/20 text-[#B26A1E]' : 'bg-[#4FB0AB]/20 text-[#2F7A77]'}`}>
              {s.role === 'admin' ? <ShieldStar weight="fill" size={18} /> : <User weight="fill" size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#155E5B]">{s.full_name || s.email}</p>
              <p className="text-xs text-[#2F7A77]">{s.email}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${s.role === 'admin' ? 'bg-[#F2A24E]/20 text-[#B26A1E]' : 'bg-[#4FB0AB]/20 text-[#2F7A77]'}`}>
              {s.role === 'admin' ? 'Admin' : 'Manager'}
            </span>
            {s.role === 'manager' && s.id !== meId && (
              <>
                <button onClick={() => resetPass(s)} className="text-[#2F7A77] hover:text-[#155E5B]" title="Cambiar contraseña">
                  <Key weight="fill" size={16} />
                </button>
                <button onClick={() => remove(s)} className="text-red-400 hover:text-red-600" title="Eliminar">
                  <Trash weight="fill" size={16} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
