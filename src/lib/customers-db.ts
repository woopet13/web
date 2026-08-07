import 'server-only'
import { pool } from './db'

export interface CustomerInput {
  email: string
  name?: string
  phone?: string
  region?: string
  comuna?: string
  address?: string
}

export interface CustomerRow {
  id: string
  email: string
  name: string | null
  phone: string | null
  region: string | null
  comuna: string | null
  address: string | null
  created_at: string
  pedidos: number
  total_gastado: number
  ultimo_pedido: string | null
}

// Registra o actualiza al cliente por email (se llama al crear un pedido).
export async function upsertCustomer(c: CustomerInput): Promise<void> {
  const email = (c.email ?? '').trim().toLowerCase()
  if (!email) return
  await pool.query(
    `INSERT INTO customers (email, name, phone, region, comuna, address)
       VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO UPDATE SET
       name    = COALESCE(NULLIF(EXCLUDED.name, ''), customers.name),
       phone   = COALESCE(NULLIF(EXCLUDED.phone, ''), customers.phone),
       region  = COALESCE(NULLIF(EXCLUDED.region, ''), customers.region),
       comuna  = COALESCE(NULLIF(EXCLUDED.comuna, ''), customers.comuna),
       address = COALESCE(NULLIF(EXCLUDED.address, ''), customers.address),
       updated_at = now()`,
    [email, c.name ?? '', c.phone ?? '', c.region ?? '', c.comuna ?? '', c.address ?? ''],
  )
}

// Listado para el admin, con agregados de pedidos pagados.
export async function getCustomers(): Promise<CustomerRow[]> {
  const { rows } = await pool.query<CustomerRow>(
    `SELECT c.id, c.email, c.name, c.phone, c.region, c.comuna, c.address, c.created_at,
            COUNT(o.id) FILTER (WHERE o.status = 'completed')::int AS pedidos,
            COALESCE(SUM(o.total) FILTER (WHERE o.status = 'completed'), 0)::int AS total_gastado,
            MAX(o.created_at) AS ultimo_pedido
       FROM customers c
       LEFT JOIN orders o ON lower(o.user_email) = c.email
      GROUP BY c.id
      ORDER BY c.created_at DESC`,
  )
  return rows
}
