// URL canónica pública del sitio (para SEO: sitemap, robots, canonical, OpenGraph).
// Se prefiere el dominio propio woopet.cl; si NEXT_PUBLIC_SITE_URL apunta a él
// se usa, si no (p.ej. el subdominio de Railway) cae al dominio canónico.
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

export const SITE_URL =
  envUrl && envUrl.includes('woopet.cl') ? envUrl : 'https://tienda.woopet.cl'

export const SITE_NAME = 'Woopet'

// Imagen por defecto para compartir en redes (OpenGraph/Twitter).
export const DEFAULT_OG_IMAGE = '/images/hero/hero-productos.jpg'

// Convierte una ruta relativa (/algo) en URL absoluta contra SITE_URL.
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
