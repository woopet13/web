import { NextResponse } from 'next/server'
import { readFile, contentTypeFor } from '@/lib/storage'

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const buffer = await readFile(file)
  if (!buffer) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': contentTypeFor(file),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
