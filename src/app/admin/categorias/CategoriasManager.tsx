'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, PencilSimple, Trash, Check, X, Tag } from '@phosphor-icons/react'
import { createCategory, renameCategory, deleteCategory } from './actions'
import type { CategoryInfo } from '@/lib/categories-db'

export default function CategoriasManager({ categories }: { categories: CategoryInfo[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCreating(true)
    const res = await createCategory(name)
    setCreating(false)
    if (res.error) { setError(res.error); return }
    setName('')
    router.refresh()
  }

  async function saveRename(oldName: string) {
    setError('')
    const res = await renameCategory(oldName, editValue)
    if (res.error) { setError(res.error); return }
    setEditing(null)
    router.refresh()
  }

  async function remove(cat: CategoryInfo) {
    setError('')
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    const res = await deleteCategory(cat.name)
    if (res.error) { setError(res.error); return }
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>
      )}

      {/* Crear */}
      <form onSubmit={add} className="flex gap-2 mb-8">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nueva categoría (p.ej. Juguetes)"
          className="flex-1 border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
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

      {/* Lista */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-12 text-center text-[#2F7A77]">
          Aún no hay categorías. Crea la primera arriba.
        </div>
      ) : (
        <ul className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm divide-y divide-[#F3E0D5]">
          {categories.map(cat => (
            <li key={cat.name} className="flex items-center gap-3 px-5 py-3.5">
              {editing === cat.name ? (
                <>
                  <input
                    autoFocus
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveRename(cat.name)}
                    className="flex-1 border border-[#F3E0D5] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
                  />
                  <button onClick={() => saveRename(cat.name)} className="text-[#4FB0AB] hover:text-[#155E5B]" title="Guardar">
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
                    onClick={() => { setEditing(cat.name); setEditValue(cat.name) }}
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
          ))}
        </ul>
      )}

      <p className="text-xs text-[#2F7A77] mt-4">
        Solo puedes eliminar categorías que no tengan productos. Al renombrar, los productos que la usan se actualizan automáticamente.
      </p>
    </div>
  )
}
