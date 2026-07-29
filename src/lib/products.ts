import { Product, PetAnimal } from '@/types'

// ── Paleta de gradientes y emojis por categoría (marca Woopet) ──
const VISUALS: Record<string, { gradient: [string, string]; emoji: string }> = {
  'Snacks Jerky|dog':  { gradient: ['#F0846E', '#F5B455'], emoji: '🦴' },
  'Snacks Jerky|cat':  { gradient: ['#3FA9A2', '#7FD1CB'], emoji: '🐟' },
  'Meat Paste|dog':    { gradient: ['#155E5B', '#3FA9A2'], emoji: '🍖' },
  'Meat Paste|cat':    { gradient: ['#4FB0AB', '#8FD9C8'], emoji: '🐾' },
  'Creamy|cat':        { gradient: ['#F0846E', '#F7A98E'], emoji: '🍦' },
  'Alimento|dog':      { gradient: ['#155E5B', '#3FA9A2'], emoji: '🐶' },
  'Alimento|cat':      { gradient: ['#F0846E', '#F5B455'], emoji: '🐱' },
  'Arena|cat':         { gradient: ['#4FB0AB', '#9BD4A0'], emoji: '🌿' },
}

const FEATURES: Record<string, string[]> = {
  'Snacks Jerky': ['Muy palatable', 'Rico en proteínas', 'Bajo en grasa', 'Horneado al horno'],
  'Meat Paste':   ['Pasta cremosa irresistible', 'Rico en proteínas', 'Bajo en grasa', 'Ideal como premio'],
  'Creamy':       ['Textura cremosa suave', 'Rico en proteínas', 'Sin colorantes', 'Fácil digestión'],
  'Alimento':     ['Libre de granos', '87% proteína de origen animal', 'Incluye bocaditos horneados', 'Fórmula completa y balanceada'],
  'Arena':        ['100% biodegradable', 'Se puede tirar por el WC', 'Excelente retención de olores', '99% libre de polvo'],
}

interface Seed {
  sku: string
  slug: string
  name: string
  animal: PetAnimal
  category: string
  weight: string
  price: number
  description: string
  longDescription: string
  boxUnits?: number
  emoji?: string
}

// Deriva gradiente + emoji a partir de categoría y animal (misma lógica que
// usa el catálogo estático). Lo usa el loader de la base para que los
// productos gestionados desde el admin tengan el mismo look.
export function getVisuals(
  category: string,
  animal: PetAnimal,
): { gradient: [string, string]; emoji: string } {
  return (
    VISUALS[`${category}|${animal}`] ?? {
      gradient: ['#3FA9A2', '#F0846E'] as [string, string],
      emoji: '🐾',
    }
  )
}

let counter = 0
function build(s: Seed): Product {
  counter += 1
  const v = getVisuals(s.category, s.animal)
  return {
    id: String(counter),
    sku: s.sku,
    slug: s.slug,
    name: s.name,
    animal: s.animal,
    category: s.category,
    weight: s.weight,
    price: s.price,
    description: s.description,
    longDescription: s.longDescription,
    boxUnits: s.boxUnits,
    emoji: s.emoji ?? v.emoji,
    gradient: v.gradient,
    features: FEATURES[s.category] ?? [],
    image: `/images/productos/${s.slug}.png`,
    images: [`/images/productos/${s.slug}.png`],
    access: 'public',
    stock: 50,
  }
}

export const products: Product[] = [
  // ─────────── SNACKS PARA PERROS · JERKY ───────────
  build({ sku: 'DA-02S', slug: 'snack-perro-pato-jerky', name: 'Snack Perro · Pato Jerky', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Tiritas de pato horneadas al horno.', longDescription: 'Deliciosas tiritas de pato Wanpy, horneadas lentamente para conservar su sabor natural. Muy palatables, ricas en proteínas y bajas en grasa: el premio perfecto para consentir a tu perro.' }),
  build({ sku: 'LA-03S', slug: 'snack-perro-cordero-jerky', name: 'Snack Perro · Cordero Jerky', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Tiritas de cordero suaves y sabrosas.', longDescription: 'Tiritas de cordero Wanpy, una proteína novedosa ideal para perros con paladares exigentes. Horneadas, ricas en proteínas y bajas en grasa.' }),
  build({ sku: 'MA-04S', slug: 'snack-perro-vacuno-jerky', name: 'Snack Perro · Vacuno Jerky', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Tiritas de vacuno horneadas.', longDescription: 'Clásicas tiritas de vacuno Wanpy, un sabor que encanta a todos los perros. Muy palatables, ricas en proteínas y bajas en grasa.' }),
  build({ sku: 'VA-01H', slug: 'snack-perro-venado-jerky', name: 'Snack Perro · Venado Jerky', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4900, description: 'Tiritas de venado, proteína premium.', longDescription: 'Exclusivas tiritas de venado Wanpy, una proteína magra y de alto valor. Perfectas para premiar entrenamientos. Ricas en proteínas y bajas en grasa.' }),
  build({ sku: 'FA-31', slug: 'snack-perro-salmon-jerky', name: 'Snack Perro · Salmón', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4900, description: 'Cubos de salmón ricos en Omega.', longDescription: 'Cubos de salmón Wanpy, fuente natural de Omega-3 para una piel sana y un pelaje brillante. Muy palatables y bajos en grasa.', emoji: '🐟' }),
  build({ sku: 'DB-16', slug: 'snack-perro-dental-vacuno', name: 'Snack Perro · Dental Vacuno', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Huesitos dentales sabor vacuno.', longDescription: 'Huesitos dentales Wanpy con sabor a vacuno: un snack funcional que ayuda a reducir el sarro mientras tu perro disfruta. Cuidado dental delicioso.', emoji: '🦷' }),
  build({ sku: 'CA-04S', slug: 'snack-perro-pollo-jerky', name: 'Snack Perro · Pollo Jerky', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Tiritas de pollo horneadas.', longDescription: 'Las favoritas: tiritas de pollo Wanpy horneadas al horno. Muy palatables, ricas en proteínas y bajas en grasa.' }),
  build({ sku: 'CE-19H', slug: 'snack-perro-pollo-zanahoria', name: 'Snack Perro · Pollo & Zanahoria', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Rollitos de pollo y zanahoria.', longDescription: 'Divertidos rollitos que combinan pollo y zanahoria, un snack colorido y nutritivo. Ricos en proteínas y bajos en grasa.', emoji: '🥕' }),
  build({ sku: 'CD-04H', slug: 'snack-perro-pollo-dumbbells', name: 'Snack Perro · Pollo Dumbbells', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Tutitos de pollo con forma de mancuerna.', longDescription: 'Tutitos de pollo Wanpy con divertida forma de mancuerna. El premio ideal para el entrenamiento diario. Ricos en proteínas y bajos en grasa.' }),
  build({ sku: 'MA-15S', slug: 'snack-perro-vacuno-cubos', name: 'Snack Perro · Vacuno Marbled', animal: 'dog', category: 'Snacks Jerky', weight: '100 g', price: 4500, description: 'Cubos de vacuno jugosos.', longDescription: 'Cubos de vacuno marmoleado Wanpy, tiernos y llenos de sabor. Muy palatables, ricos en proteínas y bajos en grasa.' }),
  build({ sku: 'M-02H', slug: 'snack-perro-pollo-mix', name: 'Snack Perro · Multi Mix Pollo', animal: 'dog', category: 'Snacks Jerky', weight: '300 g', price: 5900, description: 'Surtido multi mix de pollo (300 g).', longDescription: 'Un generoso surtido de 300 g con distintos formatos de pollo Wanpy. Variedad para que tu perro nunca se aburra. Rico en proteínas y bajo en grasa.', emoji: '🎁' }),

  // ─────────── SNACKS PARA PERROS · TASTY MEAT PASTE ───────────
  build({ sku: 'RAC-62', slug: 'pasta-perro-pollo', name: 'Pasta Perro · Pollo', animal: 'dog', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de pollo para lamer.', longDescription: 'Irresistible pasta cremosa de pollo Wanpy, ideal para premiar o dar medicación. Textura suave que las mascotas aman. Se vende por caja de 10 unidades.' }),
  build({ sku: 'RAC-63', slug: 'pasta-perro-pato', name: 'Pasta Perro · Pato & Pollo', animal: 'dog', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de pato y pollo.', longDescription: 'Suave pasta cremosa de pato y pollo Wanpy. Un premio líquido lleno de sabor y proteínas. Se vende por caja de 10 unidades.' }),
  build({ sku: 'RAC-64', slug: 'pasta-perro-vacuno', name: 'Pasta Perro · Vacuno & Pollo', animal: 'dog', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de vacuno y pollo.', longDescription: 'Deliciosa pasta cremosa de vacuno y pollo Wanpy. Perfecta para consentir a tu perro. Se vende por caja de 10 unidades.' }),
  build({ sku: 'RAC-65', slug: 'pasta-perro-cordero', name: 'Pasta Perro · Cordero & Pollo', animal: 'dog', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de cordero y pollo.', longDescription: 'Pasta cremosa de cordero y pollo Wanpy, un sabor diferente que enamora. Se vende por caja de 10 unidades.' }),

  // ─────────── SNACKS PARA GATOS · JERKY ───────────
  build({ sku: 'CA-04S-01', slug: 'snack-gato-pollo-jerky', name: 'Snack Gato · Pollo Jerky', animal: 'cat', category: 'Snacks Jerky', weight: '80 g', price: 3500, description: 'Tiritas de pollo para gatos.', longDescription: 'Tiritas de pollo Wanpy horneadas, del tamaño perfecto para gatos. Muy palatables, ricas en proteínas y bajas en grasa.' }),
  build({ sku: 'DA-02S-01', slug: 'snack-gato-pato-jerky', name: 'Snack Gato · Pato Jerky', animal: 'cat', category: 'Snacks Jerky', weight: '80 g', price: 3500, description: 'Tiritas de pato para gatos.', longDescription: 'Tiritas de pato Wanpy, una proteína novedosa que despierta el apetito de los gatos más exigentes. Ricas en proteínas y bajas en grasa.' }),
  build({ sku: 'CC-05S', slug: 'snack-gato-pollo-sushi', name: 'Snack Gato · Sushi Pollo & Bacalao', animal: 'cat', category: 'Snacks Jerky', weight: '80 g', price: 3500, description: 'Rollitos estilo sushi de pollo y bacalao.', longDescription: 'Adorables rollitos estilo sushi de pollo y bacalao Wanpy. Un snack visualmente irresistible y delicioso. Rico en proteínas y bajo en grasa.', emoji: '🍣' }),

  // ─────────── SNACKS PARA GATOS · CREAMYS ───────────
  build({ sku: 'RAC-49', slug: 'creamy-gato-pollo', name: 'Creamy Gato · Pollo', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de pollo.', longDescription: 'Cremoso snack de pollo Wanpy en tubitos, ideal para dar en la mano y fortalecer el vínculo con tu gato. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-50', slug: 'creamy-gato-atun-camaron', name: 'Creamy Gato · Atún & Camarón', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de atún, camarón y pollo.', longDescription: 'Cremoso de atún, camarón y pollo Wanpy. Sabor a mar irresistible en tubitos individuales. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-51', slug: 'creamy-gato-atun-ostion', name: 'Creamy Gato · Atún & Ostión', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de atún, ostión y pollo.', longDescription: 'Cremoso de atún, ostión y pollo Wanpy en 5 tubos de 14 g. Un manjar del mar para tu gato. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-52', slug: 'creamy-gato-atun-salmon', name: 'Creamy Gato · Atún & Salmón', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de atún, salmón y pollo.', longDescription: 'Cremoso de atún, salmón y pollo Wanpy, rico en Omega para un pelaje brillante. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-53', slug: 'creamy-gato-atun-bacalao', name: 'Creamy Gato · Atún & Bacalao', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de atún, bacalao y pollo.', longDescription: 'Cremoso de atún, bacalao y pollo Wanpy. Textura suave que encanta a los gatos. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-54', slug: 'creamy-gato-atun', name: 'Creamy Gato · Atún', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de atún y pollo.', longDescription: 'El clásico cremoso de atún y pollo Wanpy, el favorito de los gatos. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-55', slug: 'creamy-gato-atun-cangrejo', name: 'Creamy Gato · Atún & Cangrejo', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de atún, cangrejo y pollo.', longDescription: 'Cremoso de atún, cangrejo y pollo Wanpy. Un sabor gourmet del mar en cada tubito. Sin colorantes ni preservantes.' }),
  build({ sku: 'RAC-56', slug: 'creamy-gato-pollo-cangrejo', name: 'Creamy Gato · Pollo & Cangrejo', animal: 'cat', category: 'Creamy', weight: '70 g', price: 2680, description: 'Pasta cremosa de pollo y cangrejo.', longDescription: 'Cremoso de pollo y cangrejo Wanpy, la combinación perfecta entre tierra y mar. Sin colorantes ni preservantes.' }),

  // ─────────── SNACKS PARA GATOS · TASTY MEAT PASTE ───────────
  build({ sku: 'RAC-38', slug: 'pasta-gato-pollo', name: 'Pasta Gato · Pollo', animal: 'cat', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de pollo.', longDescription: 'Pasta cremosa de pollo y zanahoria Wanpy para gatos. Ideal como premio o para dar medicación. Se vende por caja de 10 unidades.' }),
  build({ sku: 'RAC-39', slug: 'pasta-gato-pato', name: 'Pasta Gato · Pato', animal: 'cat', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de pato y pollo.', longDescription: 'Pasta cremosa de pato y calabaza Wanpy para gatos. Suave y llena de sabor. Se vende por caja de 10 unidades.' }),
  build({ sku: 'RAC-40', slug: 'pasta-gato-salmon', name: 'Pasta Gato · Salmón', animal: 'cat', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de salmón y pollo.', longDescription: 'Pasta cremosa de salmón y pollo Wanpy para gatos, rica en Omega. Se vende por caja de 10 unidades.' }),
  build({ sku: 'RAC-41', slug: 'pasta-gato-atun', name: 'Pasta Gato · Atún', animal: 'cat', category: 'Meat Paste', weight: '90 g', price: 2500, boxUnits: 10, description: 'Pasta cremosa de atún y pollo.', longDescription: 'Pasta cremosa de atún y pollo Wanpy para gatos. El sabor a mar que todo gato ama. Se vende por caja de 10 unidades.' }),

  // ─────────── ALIMENTO COMPLETO · PERROS ───────────
  build({ sku: 'DFC-01', slug: 'alimento-cachorro-pollo', name: 'Alimento Cachorro · Pollo', animal: 'dog', category: 'Alimento', weight: '1,5 kg', price: 14870, description: 'Alimento completo grain-free para cachorros.', longDescription: 'Alimento completo Wanpy Grain-Free para cachorros, sabor pollo. Libre de granos, con 87% de proteína de origen animal e incluye bocaditos horneados. Nutrición premium para un crecimiento sano.' }),
  build({ sku: 'DFC-02', slug: 'alimento-perro-adulto-pollo', name: 'Alimento Perro Adulto · Pollo', animal: 'dog', category: 'Alimento', weight: '1,5 kg', price: 14870, description: 'Alimento completo grain-free para perros adultos.', longDescription: 'Alimento completo Wanpy Grain-Free para perros adultos, sabor pollo. Libre de granos, 87% de proteína animal e incluye bocaditos horneados.' }),
  build({ sku: 'DFD-01', slug: 'alimento-perro-adulto-pato', name: 'Alimento Perro Adulto · Pato', animal: 'dog', category: 'Alimento', weight: '1,5 kg', price: 15640, description: 'Alimento completo grain-free sabor pato.', longDescription: 'Alimento completo Wanpy Grain-Free para perros adultos, sabor pato. Proteína novedosa, libre de granos, 87% de proteína animal e incluye bocaditos horneados.' }),

  // ─────────── ALIMENTO COMPLETO · GATOS ───────────
  build({ sku: 'CFC-02', slug: 'alimento-gatito-pollo', name: 'Alimento Gatito · Pollo', animal: 'cat', category: 'Alimento', weight: '1,5 kg', price: 14870, description: 'Alimento completo grain-free para gatitos.', longDescription: 'Alimento completo Wanpy Grain-Free para gatitos, sabor pollo. Libre de granos, 87% de proteína animal e incluye bocaditos horneados. Ideal para un crecimiento saludable.' }),
  build({ sku: 'CFC-03', slug: 'alimento-gato-adulto-pollo', name: 'Alimento Gato Adulto · Pollo', animal: 'cat', category: 'Alimento', weight: '1,5 kg', price: 14870, description: 'Alimento completo grain-free para gatos adultos.', longDescription: 'Alimento completo Wanpy Grain-Free para gatos adultos, sabor pollo. Libre de granos, 87% de proteína animal e incluye bocaditos horneados.' }),
  build({ sku: 'CFF-03', slug: 'alimento-gato-adulto-salmon', name: 'Alimento Gato Adulto · Salmón', animal: 'cat', category: 'Alimento', weight: '1,5 kg', price: 16410, description: 'Alimento completo grain-free sabor salmón.', longDescription: 'Alimento completo Wanpy Grain-Free para gatos adultos, sabor salmón. Rico en Omega, libre de granos, 87% de proteína animal e incluye bocaditos horneados.' }),
  build({ sku: 'CFF-02', slug: 'alimento-gato-adulto-atun', name: 'Alimento Gato Adulto · Atún', animal: 'cat', category: 'Alimento', weight: '1,5 kg', price: 16410, description: 'Alimento completo grain-free sabor atún.', longDescription: 'Alimento completo Wanpy Grain-Free para gatos adultos, sabor atún. Libre de granos, 87% de proteína animal e incluye bocaditos horneados.' }),

  // ─────────── ARENAS ECOLÓGICAS ───────────
  build({ sku: 'CEV-401', slug: 'arena-ecologica-cateko', name: 'Arena Ecológica Cateko', animal: 'cat', category: 'Arena', weight: '6 L · 3 kg', price: 12460, description: 'Arena ecológica de fibra vegetal, biodegradable.', longDescription: 'Arena Cateko: la arena ecológica de fibra vegetal, 100% granulada y biodegradable. Se puede tirar por el WC, tiene excelente retención de olores y es 99% libre de polvo. Certificada antibacterial.', emoji: '🌿' }),
]

// ── Categorías para filtros de la tienda ──
export const CATEGORIES = ['Snacks Jerky', 'Meat Paste', 'Creamy', 'Alimento', 'Arena'] as const

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByAnimal(animal: PetAnimal): Product[] {
  return products.filter(p => p.animal === animal)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}
