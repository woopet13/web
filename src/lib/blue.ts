// ------------------------------------------------------------
// Cotizador de despacho — Blue Express (blue.cl)
//
// La API BX-Pricing de Blue calcula el valor de un envío según la
// comuna de ORIGEN y DESTINO + peso/dimensiones del paquete.
// Requiere los headers BX-TOKEN, BX-USERCODE y BX-CLIENT_ACCOUNT.
//
// Este módulo intenta cotizar con la API real cuando hay credenciales
// configuradas (variables BLUEX_*). Si no las hay o la API falla, cae a
// una TABLA DE TARIFAS POR ZONA (respaldo) para que el checkout siempre
// entregue un valor. Origen de Woopet: Providencia (RM).
// ------------------------------------------------------------

import { zoneForComuna, type ShippingZone } from './chile-regions'

const ORIGIN_COMUNA = process.env.BLUEX_ORIGIN_COMUNA ?? 'Providencia'

export interface ShippingQuote {
  cost: number
  /** Rango estimado de entrega en días hábiles */
  etaMin: number
  etaMax: number
  service: string
  carrier: 'Blue Express'
  weightKg: number
  /** De dónde salió el valor: API real de Blue o tarifario oficial */
  source: 'blue-api' | 'tarifa-blue'
}

// ------------------------------------------------------------
// Peso
// ------------------------------------------------------------
// Convierte presentaciones tipo "100 g", "1,5 kg", "500 gr" a kilos.
export function parseWeightKg(weight?: string): number {
  if (!weight) return 0
  const m = weight.toLowerCase().replace(',', '.').match(/([\d.]+)\s*(kg|kilos?|g|gr|gramos?)?/)
  if (!m) return 0
  const value = parseFloat(m[1])
  if (!isFinite(value)) return 0
  const unit = m[2] ?? 'g'
  return unit.startsWith('k') ? value : value / 1000
}

interface WeighableItem {
  weight?: string
  quantity: number
}

// Peso facturable del carrito: suma de pesos por cantidad + embalaje.
export function estimateCartWeightKg(items: WeighableItem[]): number {
  const content = items.reduce((sum, i) => sum + parseWeightKg(i.weight) * (i.quantity ?? 1), 0)
  const packaging = 0.2 // caja/relleno
  return Math.max(0.3, Math.round((content + packaging) * 10) / 10)
}

// ------------------------------------------------------------
// Tarifario oficial Blue Express — Ecommerce Masivos, Terrestre Express,
// ENTREGA A DOMICILIO (IVA incluido). Origen: todo Chile.
// Columnas por tramo de peso: [XS 0-0.5kg, S 0.5-3kg, M 3-6kg, L 6-16kg, XL 16-25kg].
// Sobre 25 kg: +$320 por kilo adicional. Filas por región de destino.
// ------------------------------------------------------------
type Tramo = [number, number, number, number, number]

const BLUE_TARIFF: Record<string, Tramo> = {
  'Arica y Parinacota':   [7150, 8300, 12400, 17000, 25000],
  'Tarapacá':             [6550, 7400, 10700, 15500, 23000],
  'Antofagasta':          [6300, 7000, 9900, 14000, 21000],
  'Atacama':              [4850, 5900, 7700, 9900, 13800],
  'Coquimbo':             [4600, 5300, 7000, 9600, 12800],
  'Valparaíso':           [3900, 4500, 6000, 7700, 9700],
  'Región Metropolitana': [3100, 3650, 4700, 5700, 7600],
  "O'Higgins":            [4000, 4800, 6400, 8300, 11300],
  'Maule':                [4200, 5200, 6700, 8900, 12100],
  'Ñuble':                [4600, 5400, 7200, 9200, 12600],
  'Biobío':               [4700, 5700, 7300, 9500, 12800],
  'La Araucanía':         [4950, 5900, 7700, 9900, 13800],
  'Los Ríos':             [5300, 6100, 8300, 10000, 14200],
  'Los Lagos':            [5300, 6100, 8300, 10000, 14200],
  'Aysén':                [8000, 9500, 14000, 21500, 28500],
  'Magallanes':           [8000, 9500, 14000, 21500, 28500],
}

// ETA estimada por zona (días hábiles); el tarifario no la incluye.
const ETA: Record<ShippingZone, [number, number]> = {
  rm: [1, 2], centro: [2, 3], lejano: [3, 5], extremo: [5, 8],
}

// Índice de columna según el peso (kg).
function tramoIndex(kg: number): number {
  if (kg <= 0.5) return 0
  if (kg <= 3) return 1
  if (kg <= 6) return 2
  if (kg <= 16) return 3
  return 4
}

function tarifaBlue(regionName: string, weightKg: number): ShippingQuote {
  const row = BLUE_TARIFF[regionName] ?? BLUE_TARIFF['Región Metropolitana']
  let cost = row[tramoIndex(weightKg)]
  if (weightKg > 25) cost += Math.ceil(weightKg - 25) * 320 // adicional por kilo
  const [etaMin, etaMax] = ETA[zoneForComuna(regionName)]
  return {
    cost,
    etaMin,
    etaMax,
    service: 'Express a domicilio',
    carrier: 'Blue Express',
    weightKg,
    source: 'tarifa-blue',
  }
}

// ------------------------------------------------------------
// API real de Blue Express (BX-Pricing). Solo se usa si están todas
// las credenciales. Ante cualquier fallo, devuelve null y se usa el respaldo.
// ------------------------------------------------------------
function blueCreds() {
  const token = process.env.BLUEX_TOKEN
  const userCode = process.env.BLUEX_USERCODE
  const clientAccount = process.env.BLUEX_CLIENT_ACCOUNT
  const url = process.env.BLUEX_PRICING_URL
  if (token && userCode && clientAccount && url) return { token, userCode, clientAccount, url }
  return null
}

async function cotizarBlueApi(
  destComuna: string,
  weightKg: number,
): Promise<ShippingQuote | null> {
  const creds = blueCreds()
  if (!creds) return null

  try {
    const res = await fetch(creds.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BX-TOKEN': creds.token,
        'BX-USERCODE': creds.userCode,
        'BX-CLIENT_ACCOUNT': creds.clientAccount,
      },
      body: JSON.stringify({
        origin: ORIGIN_COMUNA,
        destination: destComuna,
        weight: weightKg,
        // dimensiones estimadas de una caja mediana (cm)
        length: 30,
        width: 25,
        height: 15,
      }),
      // no bloquear el checkout si Blue tarda
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = await res.json()
    // La API devuelve el valor del servicio; contemplamos las formas más comunes.
    const cost = Number(
      data?.cost ?? data?.price ?? data?.total ?? data?.data?.price ?? data?.data?.total,
    )
    if (!isFinite(cost) || cost <= 0) return null
    return {
      cost: Math.round(cost),
      etaMin: Number(data?.etaMin ?? data?.data?.eta_min) || 1,
      etaMax: Number(data?.etaMax ?? data?.data?.eta_max) || 3,
      service: String(data?.service ?? data?.data?.service ?? 'Express'),
      carrier: 'Blue Express',
      weightKg,
      source: 'blue-api',
    }
  } catch {
    return null
  }
}

// ------------------------------------------------------------
// Entrada pública
// ------------------------------------------------------------
export async function quoteShipping(input: {
  regionName: string
  comuna: string
  weightKg: number
}): Promise<ShippingQuote> {
  const fromApi = await cotizarBlueApi(input.comuna, input.weightKg)
  return fromApi ?? tarifaBlue(input.regionName, input.weightKg)
}
