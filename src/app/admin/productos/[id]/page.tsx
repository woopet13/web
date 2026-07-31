import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import ProductoEditor from '../ProductoEditor'
import { getCategories } from '@/lib/categories-db'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).single()

  if (!data) notFound()

  const categories = await getCategories()

  const initial = {
    ...data,
    animal: data.animal === 'cat' ? 'cat' : 'dog',
    weight: data.weight ?? '',
    features: Array.isArray(data.features) ? data.features.join('\n') : '',
    variants: data.variants ?? [],
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[#155E5B] mb-8">Editar producto</h1>
      <ProductoEditor initial={initial} categories={categories} />
    </div>
  )
}
