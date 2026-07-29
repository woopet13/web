export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  emoji: string
  gradient: [string, string]
  date: string // ISO
  content: string // markdown
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Nutrición': 'bg-[#4FB0AB]/20 text-[#2E8B87]',
  'Cuidados': 'bg-[#F2A24E]/20 text-[#F2A24E]',
  'Snacks': 'bg-[#F0846E]/20 text-[#F0846E]',
  'Gatos': 'bg-[#155E5B]/15 text-[#155E5B]',
  'General': 'bg-[#F3E0D5] text-[#2F7A77]',
}

// Emoji + gradiente por categoría (para las cards del blog). Lo usa el loader
// de la base para que los posts gestionados desde el admin luzcan bien.
const BLOG_VISUALS: Record<string, { emoji: string; gradient: [string, string] }> = {
  'Nutrición': { emoji: '🌾', gradient: ['#155E5B', '#3FA9A2'] },
  'Cuidados':  { emoji: '🐾', gradient: ['#F2A24E', '#F5B455'] },
  'Snacks':    { emoji: '🦴', gradient: ['#F0846E', '#F5B455'] },
  'Gatos':     { emoji: '🐱', gradient: ['#4FB0AB', '#9BD4A0'] },
  'General':   { emoji: '🐾', gradient: ['#3FA9A2', '#F0846E'] },
}

export function getBlogVisuals(category: string): { emoji: string; gradient: [string, string] } {
  return BLOG_VISUALS[category] ?? BLOG_VISUALS['General']
}

export const posts: BlogPost[] = [
  {
    slug: 'como-elegir-snacks-perro',
    title: 'Cómo elegir los mejores snacks para tu perro',
    excerpt: 'No todos los premios son iguales. Te contamos qué mirar para elegir snacks ricos, sanos y adecuados para tu perro.',
    category: 'Snacks',
    emoji: '🦴',
    gradient: ['#F0846E', '#F5B455'],
    date: '2026-07-10',
    content: `Los snacks son mucho más que un premio: son una herramienta de vínculo, entrenamiento y bienestar. Pero elegir bien marca la diferencia.

## Fíjate en los ingredientes

Prefiere snacks con **proteína de origen animal como primer ingrediente** y evita los que tienen exceso de rellenos, azúcares o colorantes. Los snacks tipo *jerky* horneado, como los de Wanpy, conservan el sabor natural de la carne y son bajos en grasa.

## Ajusta la cantidad

Los premios no deberían superar el **10% de las calorías diarias** de tu perro. Úsalos con moderación, sobre todo en el entrenamiento.

## Variedad y textura

- **Jerky y tiritas:** ideales para premiar sobre la marcha.
- **Snacks dentales:** ayudan a reducir el sarro mientras mastican.
- **Pastas cremosas:** perfectas para dar medicación o como premio especial.

> Un buen snack es aquel que a tu perro le encanta y a ti te deja tranquilo por su calidad.

En Woopet seleccionamos snacks premium para que premiar sea siempre una buena decisión. 🐶`,
  },
  {
    slug: 'alimentacion-grain-free',
    title: 'Alimento grain-free: ¿qué es y cuándo conviene?',
    excerpt: 'El alimento libre de granos gana popularidad. Te explicamos en qué consiste y para qué mascotas puede ser una buena opción.',
    category: 'Nutrición',
    emoji: '🌾',
    gradient: ['#155E5B', '#3FA9A2'],
    date: '2026-07-05',
    content: `El alimento **grain-free** (libre de granos) reemplaza cereales como maíz, trigo y soya por otras fuentes de energía, priorizando la proteína animal.

## Ventajas principales

- **Mayor porcentaje de proteína animal**, más cercano a la dieta natural de perros y gatos.
- Puede ayudar a mascotas con **sensibilidades digestivas** a ciertos granos.
- Fórmulas como Wanpy Grain-Free incluyen **bocaditos horneados** que mejoran la palatabilidad.

## ¿Para quién es ideal?

Es una buena opción para mascotas activas, con estómagos sensibles o simplemente para quienes buscan una nutrición más premium. Ante dudas específicas de salud, siempre conviene consultar con tu veterinario.

## Transición gradual

Al cambiar de alimento, hazlo **durante 7 a 10 días**, mezclando cada vez más el nuevo con el anterior para evitar molestias digestivas.`,
  },
  {
    slug: 'arena-ecologica-gatos',
    title: 'Arena ecológica: mejor para tu gato y el planeta',
    excerpt: 'La arena biodegradable de fibra vegetal es una alternativa más limpia y sustentable. Te contamos por qué gusta tanto.',
    category: 'Gatos',
    emoji: '🌿',
    gradient: ['#4FB0AB', '#9BD4A0'],
    date: '2026-06-28',
    content: `Las arenas ecológicas de **fibra vegetal**, como Cateko, están cambiando la forma de cuidar la caja de arena.

## Sus grandes ventajas

- **100% biodegradable** y de origen vegetal.
- Se puede **tirar por el WC**, facilitando la limpieza.
- Excelente **retención de olores** y **99% libre de polvo**, ideal para gatos y personas con alergias.
- Certificada antibacterial.

## Tips para la transición

Los gatos son sensibles a los cambios. Mezcla la arena nueva con la habitual durante unos días y mantén la caja siempre limpia para que la adopten sin problemas.

> Una arena más limpia y responsable hace feliz a tu gato… y a tu casa. 🐱`,
  },
  {
    slug: 'premios-para-gatos-creamys',
    title: 'Creamys: el premio que los gatos aman',
    excerpt: 'Suaves, cremosos e irresistibles. Descubre por qué los snacks cremosos son perfectos para consentir y fortalecer el vínculo con tu gato.',
    category: 'Snacks',
    emoji: '🍦',
    gradient: ['#F0846E', '#F7A98E'],
    date: '2026-06-20',
    content: `Los snacks **cremosos** en tubito se han vuelto los favoritos de los gatos, y por buenas razones.

## ¿Por qué encantan?

- Textura suave y **alta palatabilidad**: pocos gatos se resisten.
- Se pueden dar **directo en la mano**, fortaleciendo el vínculo.
- Ideales para **esconder medicación** o premiar en la visita al veterinario.
- Variedades de atún, salmón, pollo y mariscos, **sin colorantes ni preservantes**.

## Cómo usarlos bien

Son un premio, no un reemplazo del alimento. Dáselos con moderación y como refuerzo positivo. ¡Verás cómo tu gato viene corriendo apenas escucha el sonido del tubito! 🐟`,
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug)
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}
