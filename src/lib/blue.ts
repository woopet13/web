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
  /** De dónde salió el valor: API real de Blue o tabla de respaldo */
  source: 'blue-api' | 'tarifa-zona'
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

// Peso facturable del carrito: suma de pesos por cantidad + embalaje,
// con un mínimo razonable (Blue cobra desde ~1 kg).
export function estimateCartWeightKg(items: WeighableItem[]): number {
  const content = items.reduce((sum, i) => sum + parseWeightKg(i.weight) * (i.quantity ?? 1), 0)
  const packaging = 0.2 // caja/relleno
  return Math.max(1, Math.round((content + packaging) * 10) / 10)
}

// ------------------------------------------------------------
// Respaldo: tarifa por zona (CLP). base = hasta 1 kg; extra = por kg adicional.
// ------------------------------------------------------------
const ZONE_TARIFF: Record<ShippingZone, { base: number; perKg: number; etaMin: number; etaMax: number }> = {
  rm:      { base: 3290, perKg: 900,  etaMin: 1, etaMax: 2 },
  centro:  { base: 4490, perKg: 1100, etaMin: 2, etaMax: 3 },
  lejano:  { base: 5990, perKg: 1400, etaMin: 3, etaMax: 5 },
  extremo: { base: 8990, perKg: 2200, etaMin: 5, etaMax: 8 },
}

function tarifaPorZona(regionName: string, weightKg: number): ShippingQuote {
  const zone = zoneForComuna(regionName)
  const t = ZONE_TARIFF[zone]
  const extraKg = Math.max(0, Math.ceil(weightKg - 1))
  const cost = Math.round((t.base + extraKg * t.perKg) / 10) * 10
  return {
    cost,
    etaMin: t.etaMin,
    etaMax: t.etaMax,
    service: 'Express',
    carrier: 'Blue Express',
    weightKg,
    source: 'tarifa-zona',
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
  return fromApi ?? tarifaPorZona(input.regionName, input.weightKg)
}
