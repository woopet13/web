// Shim de compatibilidad para el "cliente admin" (antes service_role).
// Ya no hay RLS: en Postgres propio el acceso es directo. Solo exponemos
// from() para consultas, que es lo único que usaban los call sites.
import { db } from './db'

export function createAdminClient() {
  return {
    from: db.from,
  }
}
