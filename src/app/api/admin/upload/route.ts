import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { saveFile } from '@/lib/storage'

export async function POST(req: NextRequest) {
  // Verificar que es el admin
  const user = await getSessionUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file') as File
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'webp'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await saveFile(filename, buffer)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al guardar el archivo'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // URL servida por nuestra propia ruta (mismo origen).
  return NextResponse.json({ url: `/api/media/${filename}` })
}
