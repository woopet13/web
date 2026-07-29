import { Pool } from 'pg'

// ------------------------------------------------------------
// Pool de conexiones (singleton, sobrevive al hot-reload de dev)
// ------------------------------------------------------------
const globalForPool = globalThis as unknown as { _pgPool?: Pool }

export const pool =
  globalForPool._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Railway interno (*.railway.internal) no requiere SSL.
    // Para conexiones por proxy público, pon DATABASE_SSL=true.
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: 10,
  })

if (process.env.NODE_ENV !== 'production') globalForPool._pgPool = pool

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
const IDENT = /^[a-z_][a-z0-9_]*$/i

function ident(name: string): string {
  const n = name.trim()
  if (!IDENT.test(n)) throw new Error(`Identificador inválido: ${name}`)
  return `"${n}"`
}

function selectList(cols: string): string {
  if (!cols || cols.trim() === '*') return '*'
  return cols
    .split(',')
    .map(c => ident(c))
    .join(', ')
}

// pg serializa arrays JS como arrays de Postgres; para columnas jsonb
// necesitamos JSON. Serializamos cualquier objeto/array a texto JSON.
function serialize(v: unknown): unknown {
  if (v !== null && typeof v === 'object' && !(v instanceof Date)) {
    return JSON.stringify(v)
  }
  return v
}

type Filter = { col: string; val: unknown }
type Order = { col: string; ascending: boolean }
type Op = 'select' | 'insert' | 'update' | 'delete'

type DbError = { message: string } | null

// Resultado de lista: data es un array (como supabase-js sin tipos generados).
// Es un array para que `data.map(x => ...)` infiera el elemento sin implicit-any.
export interface DbListResult {
  data: any[]
  error: DbError
  count?: number | null
}

// Resultado de fila única (.single()): data es un objeto o null.
export interface DbSingleResult {
  data: any
  error: DbError
}

// ------------------------------------------------------------
// Query builder encadenable y "thenable" (imita la API de PostgREST
// que usaba supabase-js, para no reescribir los call sites)
// ------------------------------------------------------------
class QueryBuilder implements PromiseLike<DbListResult> {
  private op: Op = 'select'
  private cols = '*'
  private filters: Filter[] = []
  private orders: Order[] = []
  private payload: Record<string, unknown> | null = null
  private _single = false
  private _count = false
  private _head = false

  constructor(private table: string) {}

  select(cols = '*', opts?: { count?: 'exact'; head?: boolean }): this {
    this.op = 'select'
    this.cols = cols
    if (opts?.count) this._count = true
    if (opts?.head) this._head = true
    return this
  }

  insert(payload: Record<string, unknown>): this {
    this.op = 'insert'
    this.payload = payload
    return this
  }

  update(payload: Record<string, unknown>): this {
    this.op = 'update'
    this.payload = payload
    return this
  }

  delete(): this {
    this.op = 'delete'
    return this
  }

  eq(col: string, val: unknown): this {
    this.filters.push({ col, val })
    return this
  }

  order(col: string, opts?: { ascending?: boolean }): this {
    this.orders.push({ col, ascending: opts?.ascending ?? true })
    return this
  }

  single(): PromiseLike<DbSingleResult> {
    this._single = true
    return this as unknown as PromiseLike<DbSingleResult>
  }

  private whereClause(params: unknown[]): string {
    if (this.filters.length === 0) return ''
    const parts = this.filters.map(f => {
      params.push(f.val)
      return `${ident(f.col)} = $${params.length}`
    })
    return ' WHERE ' + parts.join(' AND ')
  }

  private build(): { text: string; values: unknown[] } {
    const t = ident(this.table)
    const values: unknown[] = []

    if (this.op === 'select') {
      if (this._head && this._count) {
        return { text: `SELECT COUNT(*)::int AS count FROM ${t}${this.whereClause(values)}`, values }
      }
      let text = `SELECT ${selectList(this.cols)} FROM ${t}${this.whereClause(values)}`
      if (this.orders.length) {
        text +=
          ' ORDER BY ' +
          this.orders.map(o => `${ident(o.col)} ${o.ascending ? 'ASC' : 'DESC'}`).join(', ')
      }
      return { text, values }
    }

    if (this.op === 'insert') {
      const entries = Object.entries(this.payload ?? {})
      const cols = entries.map(([k]) => ident(k)).join(', ')
      const placeholders = entries.map(([, v]) => {
        values.push(serialize(v))
        return `$${values.length}`
      }).join(', ')
      return { text: `INSERT INTO ${t} (${cols}) VALUES (${placeholders}) RETURNING *`, values }
    }

    if (this.op === 'update') {
      const entries = Object.entries(this.payload ?? {})
      const sets = entries.map(([k, v]) => {
        values.push(serialize(v))
        return `${ident(k)} = $${values.length}`
      }).join(', ')
      return { text: `UPDATE ${t} SET ${sets}${this.whereClause(values)} RETURNING *`, values }
    }

    // delete
    return { text: `DELETE FROM ${t}${this.whereClause(values)}`, values }
  }

  private async exec(): Promise<DbListResult> {
    try {
      const { text, values } = this.build()
      const res = await pool.query(text, values as any[])

      if (this.op === 'select' && this._head && this._count) {
        return { data: [], error: null, count: res.rows[0]?.count ?? 0 }
      }
      if (this.op === 'select' && this._single) {
        // Se consume como DbSingleResult vía single(); data = fila|null.
        return { data: (res.rows[0] ?? null) as any, error: null }
      }
      if (this.op === 'select') {
        return { data: res.rows, error: null, count: res.rowCount }
      }
      // insert/update devuelven la(s) fila(s); delete no. Los call sites
      // solo leen `error`.
      return { data: res.rows ?? [], error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { data: [], error: { message } }
    }
  }

  then<R1 = DbListResult, R2 = never>(
    onfulfilled?: ((value: DbListResult) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return this.exec().then(onfulfilled, onrejected)
  }
}

// API pública: db.from('tabla')...
export const db = {
  from(table: string): QueryBuilder {
    return new QueryBuilder(table)
  },
}
