'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { saveProduct, deleteProduct } from './actions'

interface Variant {
  id: string
  label: string
  price: number
}

interface Producto {
  id?: string
  name: string
  slug: string
  description: string
  long_description: string
  price: number
  image: string
  category: string
  animal: 'dog' | 'cat'
  weight: string
  access: 'public' | 'members'
  stock: number
  active: boolean
  features: string
  variants: Variant[]
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export default function ProductoEditor({
  initial,
  categories = [],
}: {
  initial?: Producto
  categories?: string[]
}) {
  const router = useRouter()
  const isNew = !initial?.id

  const [form, setForm] = useState<Producto>(initial ?? {
    name: '', slug: '', description: '', long_description: '',
    price: 0, image: '', category: categories[0] ?? '', animal: 'dog', weight: '',
    access: 'public', stock: 0,
    active: true, features: '', variants: [],
  })

  // Incluye la categoría actual del producto aunque ya no esté en la lista.
  const categoryOptions = form.category && !categories.includes(form.category)
    ? [form.category, ...categories]
    : categories
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const data = new FormData()
    data.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
    const json = await res.json()
    setUploading(false)
    if (json.url) set('image', json.url)
    else setError(json.error ?? 'Error al subir imagen')
  }

  function set<K extends keyof Producto>(field: K, value: Producto[K]) {
    setForm(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'name' && isNew) updated.slug = toSlug(value as string)
      return updated
    })
  }

  function addVariant() {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { id: crypto.randomUUID(), label: '', price: prev.price }],
    }))
  }

  function updateVariant(idx: number, field: keyof Variant, value: string | number) {
    setForm(prev => {
      const variants = [...prev.variants]
      variants[idx] = { ...variants[idx], [field]: value }
      return { ...prev, variants }
    })
  }

  function removeVariant(idx: number) {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }))
  }

  async function save() {
    setSaving(true)
    setError('')
    setSuccess('')

    const result = await saveProduct({
      id: form.id,
      name: form.name,
      slug: form.slug,
      description: form.description,
      long_description: form.long_description,
      price: form.price,
      image: form.image,
      category: form.category,
      animal: form.animal,
      weight: form.weight,
      access: form.access,
      stock: form.stock,
      active: form.active,
      features: form.features.split('\n').filter(Boolean),
      variants: form.variants,
    })

    setSaving(false)
    if (result.error) { setError(result.error); return }
    setSuccess('Guardado correctamente.')
    setTimeout(() => router.push('/admin/productos'), 900)
  }

  async function deleteProducto() {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    const result = await deleteProduct(form.id!)
    if (result.error) { setError(result.error); setDeleting(false); return }
    router.push('/admin/productos')
  }

  return (
    <div className="max-w-3xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">{success}</div>}

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Nombre *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Nombre del producto"
            className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">URL (slug) *</label>
          <div className="flex items-center border border-[#F3E0D5] rounded-xl bg-white overflow-hidden">
            <span className="px-3 py-3 text-xs text-[#2F7A77] bg-[#FFF6EE] border-r border-[#F3E0D5]">/productos/</span>
            <input
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              className="flex-1 px-3 py-3 text-sm focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Categoría y Acceso */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Categoría</label>
            {categoryOptions.length === 0 ? (
              <p className="text-xs text-[#2F7A77] border border-[#F3E0D5] rounded-xl px-4 py-3 bg-white">
                No hay categorías. Créalas en <span className="font-semibold">Categorías</span>.
              </p>
            ) : (
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
              >
                {categoryOptions.map(c => <option key={c}>{c}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Acceso</label>
            <select
              value={form.access}
              onChange={e => set('access', e.target.value as 'public' | 'members')}
              className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
            >
              <option value="public">Público</option>
              <option value="members">Solo miembros</option>
            </select>
          </div>
        </div>

        {/* Mascota y Peso */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Mascota</label>
            <select
              value={form.animal}
              onChange={e => set('animal', e.target.value as 'dog' | 'cat')}
              className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
            >
              <option value="dog">Perro 🐶</option>
              <option value="cat">Gato 🐱</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Peso / presentación</label>
            <input
              value={form.weight}
              onChange={e => set('weight', e.target.value)}
              placeholder="p.ej. 100 g"
              className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
            />
          </div>
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Precio base (CLP)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => set('price', Number(e.target.value))}
              className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => set('stock', Number(e.target.value))}
              className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
            />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Imagen del producto</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-[#F3E0D5] rounded-xl p-5 cursor-pointer hover:border-[#F2A24E] transition-colors bg-white text-center"
          >
            {form.image ? (
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#FFF6EE]">
                  <Image src={form.image} alt="Preview" fill className="object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#155E5B]">Imagen cargada</p>
                  <p className="text-xs text-[#F2A24E] mt-1">Click para cambiar</p>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-2xl mb-2">🖼️</p>
                <p className="text-sm font-medium text-[#155E5B]">
                  {uploading ? 'Subiendo...' : 'Click para subir imagen'}
                </p>
                <p className="text-xs text-[#2F7A77] mt-1">JPG, PNG o WEBP · Máx. 5 MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {uploading && <p className="text-xs text-[#F2A24E] mt-1.5 animate-pulse">Subiendo imagen...</p>}
        </div>

        {/* Descripción corta */}
        <div>
          <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Descripción corta</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={2}
            className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white resize-none"
          />
        </div>

        {/* Descripción larga */}
        <div>
          <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">Descripción larga</label>
          <textarea
            value={form.long_description}
            onChange={e => set('long_description', e.target.value)}
            rows={5}
            className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white resize-y"
          />
        </div>

        {/* Características */}
        <div>
          <label className="block text-sm font-semibold text-[#155E5B] mb-1.5">
            Características
            <span className="text-xs font-normal text-[#2F7A77] ml-2">(una por línea)</span>
          </label>
          <textarea
            value={form.features}
            onChange={e => set('features', e.target.value)}
            rows={4}
            placeholder="Rico en proteínas&#10;Bajo en grasa&#10;Horneado al horno&#10;..."
            className="w-full border border-[#F3E0D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white resize-none"
          />
        </div>

        {/* Variantes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-[#155E5B]">Variantes</label>
            <button
              type="button"
              onClick={addVariant}
              className="text-xs text-[#F2A24E] hover:underline font-medium"
            >
              + Agregar variante
            </button>
          </div>
          {form.variants.length === 0 && (
            <p className="text-xs text-[#2F7A77] italic">Sin variantes — se usa el precio base.</p>
          )}
          <div className="space-y-2">
            {form.variants.map((v, i) => (
              <div key={v.id} className="flex gap-2 items-center">
                <input
                  value={v.label}
                  onChange={e => updateVariant(i, 'label', e.target.value)}
                  placeholder="Ej: 30 unidades"
                  className="flex-1 border border-[#F3E0D5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
                />
                <input
                  type="number"
                  value={v.price}
                  onChange={e => updateVariant(i, 'price', Number(e.target.value))}
                  placeholder="Precio"
                  className="w-32 border border-[#F3E0D5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A24E] bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-400 hover:text-red-600 text-xs px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Opciones */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[#155E5B] cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => set('active', e.target.checked)}
              className="accent-[#F2A24E]"
            />
            Producto activo
          </label>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving || !form.name || !form.slug}
            className="bg-[#155E5B] text-[#FFF6EE] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2F7A77] transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/productos')}
            className="border border-[#F3E0D5] text-[#155E5B] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#F3E0D5] transition-colors"
          >
            Cancelar
          </button>
          {!isNew && (
            <button
              onClick={deleteProducto}
              disabled={deleting}
              className="ml-auto text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              {deleting ? 'Eliminando…' : 'Eliminar producto'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
