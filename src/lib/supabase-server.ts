// Shim de compatibilidad para el "cliente de servidor".
// Reemplaza a @supabase/ssr: expone auth.getUser() (lee la cookie de sesión)
// y from() para consultas a Postgres, con la misma forma que usaba supabase-js.
import { db } from './db'
import { getSessionUser } from './auth'

export async function createClient() {
  return {
    auth: {
      async getUser() {
        const user = await getSessionUser()
        return { data: { user }, error: null }
      },
    },
    from: db.from,
  }
}
