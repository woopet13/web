import 'server-only'
import { pool } from './db'

// Se consideran "ventas" los pedidos pagados (todo lo que no está pendiente
// ni cancelado). El pago de Flow marca 'completed'; el admin puede pasarlo a
// 'processing' durante la preparación.
const PAID = `status NOT IN ('pending', 'cancelled')`

// Filtro de mes opcional: 'YYYY-MM' o null (todo el histórico).
function monthClause(mes: string | null, params: unknown[]): string {
  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) return ''
  params.push(mes)
  return ` AND to_char(created_at, 'YYYY-MM') = $${params.length}`
}

export interface FinanceSummary {
  totalVentas: number
  nPedidos: number
  ticketPromedio: number
  unidades: number
  despachoTotal: number
}

export async function getSummary(mes: string | null): Promise<FinanceSummary> {
  const p1: unknown[] = []
  const { rows: r1 } = await pool.query(
    `SELECT COUNT(*)::int AS n,
            COALESCE(SUM(total), 0)::int AS total,
            COALESCE(SUM(shipping_cost), 0)::int AS despacho
       FROM orders WHERE ${PAID}${monthClause(mes, p1)}`,
    p1,
  )
  const p2: unknown[] = []
  const { rows: r2 } = await pool.query(
    `SELECT COALESCE(SUM((it->>'quantity')::numeric), 0)::int AS unidades
       FROM orders o, jsonb_array_elements(o.items) it
      WHERE ${PAID.replace(/status/g, 'o.status')}${monthClause(mes, p2).replace('created_at', 'o.created_at')}`,
    p2,
  )
  const n = r1[0]?.n ?? 0
  const total = r1[0]?.total ?? 0
  return {
    totalVentas: total,
    nPedidos: n,
    ticketPromedio: n ? Math.round(total / n) : 0,
    unidades: r2[0]?.unidades ?? 0,
    despachoTotal: r1[0]?.despacho ?? 0,
  }
}

export interface TopProduct {
  name: string
  qty: number
  revenue: number
}

export async function getTopProducts(mes: string | null, limit = 10): Promise<TopProduct[]> {
  const params: unknown[] = []
  const clause = monthClause(mes, params).replace('created_at', 'o.created_at')
  params.push(limit)
  const { rows } = await pool.query<TopProduct>(
    `SELECT it->>'name' AS name,
            SUM((it->>'quantity')::numeric)::int AS qty,
            SUM((it->>'price')::numeric * (it->>'quantity')::numeric)::int AS revenue
       FROM orders o, jsonb_array_elements(o.items) it
      WHERE o.status NOT IN ('pending', 'cancelled')${clause}
      GROUP BY it->>'name'
      ORDER BY qty DESC
      LIMIT $${params.length}`,
    params,
  )
  return rows
}

export interface MonthlySales {
  mes: string
  total: number
  n: number
}

// Últimos 12 meses.
export async function getMonthlySales(): Promise<MonthlySales[]> {
  const { rows } = await pool.query<MonthlySales>(
    `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS mes,
            COUNT(*)::int AS n,
            COALESCE(SUM(total), 0)::int AS total
       FROM orders
      WHERE ${PAID}
        AND created_at >= date_trunc('month', now()) - interval '11 months'
      GROUP BY 1 ORDER BY 1`,
  )
  return rows
}

// Meses con ventas, para el selector.
export async function getMonthsWithSales(): Promise<string[]> {
  const { rows } = await pool.query<{ mes: string }>(
    `SELECT DISTINCT to_char(created_at, 'YYYY-MM') AS mes
       FROM orders WHERE ${PAID} ORDER BY 1 DESC`,
  )
  return rows.map(r => r.mes)
}
