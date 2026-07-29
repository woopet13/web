import 'server-only'
import path from 'node:path'
import { promises as fs } from 'node:fs'

// Directorio donde se guardan los archivos subidos.
// En Railway: monta un volumen (p.ej. en /data) y pon UPLOAD_DIR=/data/uploads
// Se resuelve de forma perezosa para no ejecutar fs/cwd en el scope del módulo.
export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
}

// Solo permitimos nombres de archivo simples: evita path traversal.
const SAFE_NAME = /^[a-zA-Z0-9._-]+$/

export function isSafeFilename(name: string): boolean {
  return SAFE_NAME.test(name) && !name.includes('..')
}

export async function saveFile(filename: string, buffer: Buffer): Promise<void> {
  const dir = uploadDir()
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), buffer)
}

export async function readFile(filename: string): Promise<Buffer | null> {
  if (!isSafeFilename(filename)) return null
  try {
    return await fs.readFile(path.join(uploadDir(), filename))
  } catch {
    return null
  }
}

const MIME: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
}

export function contentTypeFor(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return MIME[ext] ?? 'application/octet-stream'
}
