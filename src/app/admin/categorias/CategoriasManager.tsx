'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, PencilSimple, Trash, Check, X, Tag, Dog, Cat } from '@phosphor-icons/react'
import { createCategory, renameCategory, deleteCategory } from './actions'
import type { CategoryInfo, Animal } from '@/lib/categories-db'

const PARENTS: { key: Animal; label: string; Icon: any }[] = [
  { key: 'dog', label: 'Perros', Icon: Dog },
  { key: 'cat', label: 'Gatos', Icon: Cat },
]

export default function CategoriasManager({ categories }: { categories: CategoryInfo[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [parent, setParent] = useState<Animal>('dog')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<string | null>(null) // clave `${animal}:${name}`
  const [editValue, setEditValue] = useState('')

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCreating(true)
    const res = await createCategory(name, parent)
    setCreating(false)
    if (res.error) { setError(res.error); return }
    setName('')
    router.refresh()
  }

  async function saveRename(cat: CategoryInfo) {
    setError('')
    const res = await renameCategory(cat.name, cat.animal, editValue)
    if (res.error) { setError(res.error); return }
    setEditing(null)
    router.refresh()
  }

  async function remove(cat: CategoryInfo) {
    setError('')
    if (!confirm(`¿Eliminar la subcategoría "${cat.name}"?`)) return
    const res = await deleteCategory(cat.name, cat.animal)
    if (res.error) { setError(res.error); return }
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>
      )}

      {/* Crear */}
      <form onSubmit={add} className="flex flex-wrap gap-2 mb-8">
        <select
          value={parent}
          onChange={e => setParent(e.target.value as Animal)}
          className="border border-[#F3E0D5] rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
        >
          <option value="dog">🐶 Perros</option>
          <option value="cat">🐱 Gatos</option>
        </select>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nueva subcategoría (p.ej. Alimento)"
          className="flex-1 min-w-[180px] border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="bg-[#155E5B] text-[#FFF6EE] px-5 py-3 rounded-xl text-sm font-medium hover:bg-[#2F7A77] transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <Plus weight="bold" size={16} />
          {creating ? 'Creando…' : 'Crear'}
        </button>
      </form>

      {/* Listas por mascota */}
      <div className="space-y-8">
        {PARENTS.map(({ key, label, Icon }) => {
          const items = categories.filter(c => c.animal === key)
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <Icon weight="fill" size={20} className="text-[#F0846E]" />
                <h2 className="font-display font-bold text-[#155E5B] text-lg">{label}</h2>
                <span className="text-xs text-[#2F7A77]">
                  {items.length} {items.length === 1 ? 'subcategoría' : 'subcategorías'}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#F3E0D5] p-8 text-center text-[#2F7A77] text-sm">
                  Sin subcategorías para {label.toLowerCase()}. Crea una arriba.
                </div>
              ) : (
                <ul className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm divide-y divide-[#F3E0D5]">
                  {items.map(cat => {
                    const editKey = `${cat.animal}:${cat.name}`
                    return (
                      <li key={editKey} className="flex items-center gap-3 px-5 py-3.5">
                        {editing === editKey ? (
                          <>
                            <input
                              autoFocus
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && saveRename(cat)}
                              className="flex-1 border border-[#F3E0D5] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
                            />
                            <button onClick={() => saveRename(cat)} className="text-[#4FB0AB] hover:text-[#155E5B]" title="Guardar">
                              <Check weight="bold" size={18} />
                            </button>
                            <button onClick={() => setEditing(null)} className="text-[#2F7A77] hover:text-[#155E5B]" title="Cancelar">
                              <X weight="bold" size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <Tag weight="fill" size={16} className="text-[#F2A24E] shrink-0" />
                            <span className="flex-1 text-sm font-medium text-[#155E5B]">{cat.name}</span>
                            <span className="text-xs text-[#2F7A77]">
                              {cat.count} {cat.count === 1 ? 'producto' : 'productos'}
                            </span>
                            <button
                              onClick={() => { setEditing(editKey); setEditValue(cat.name) }}
                              className="text-[#2F7A77] hover:text-[#155E5B] ml-2"
                              title="Renombrar"
                            >
                              <PencilSimple weight="fill" size={16} />
                            </button>
                            <button
                              onClick={() => remove(cat)}
                              className="text-red-400 hover:text-red-600"
                              title="Eliminar"
                            >
                              <Trash weight="fill" size={16} />
                            </button>
                          </>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-[#2F7A77] mt-6">
        Cada subcategoría pertenece a una mascota (Perros o Gatos). Solo puedes eliminar las que no tengan productos.
        Al renombrar, los productos de esa mascota se actualizan automáticamente.
      </p>
    </div>
  )
}
