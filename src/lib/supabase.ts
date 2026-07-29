// Shim de compatibilidad para el cliente de navegador.
// Mantiene la misma API que usaba supabase-js (auth.*) pero por debajo
// habla con nuestras rutas /api/auth/*. Solo usa fetch: seguro en el browser.

export interface AppUser {
  id: string
  email: string
  full_name?: string
}

const AUTH_EVENT = 'cf-auth-change'

function emitAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT))
  }
}

export function createClient() {
  return {
    auth: {
      async getUser(): Promise<{ data: { user: AppUser | null }; error: null }> {
        try {
          const res = await fetch('/api/auth/me', { cache: 'no-store' })
          const json = await res.json()
          return { data: { user: json.user ?? null }, error: null }
        } catch {
          return { data: { user: null }, error: null }
        }
      },

      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const json = await res.json()
        if (!res.ok) return { data: { user: null }, error: json.error ?? { message: 'Error' } }
        emitAuthChange()
        return { data: { user: json.user as AppUser }, error: null }
      },

      async signUp({
        email,
        password,
        options,
      }: {
        email: string
        password: string
        options?: { data?: { full_name?: string } }
      }) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: options?.data?.full_name }),
        })
        const json = await res.json()
        if (!res.ok) return { data: { user: null }, error: json.error ?? { message: 'Error' } }
        emitAuthChange()
        return { data: { user: json.user as AppUser }, error: null }
      },

      async signOut() {
        await fetch('/api/auth/logout', { method: 'POST' })
        emitAuthChange()
        return { error: null }
      },

      // Reactividad: escucha cambios disparados por login/logout en esta pestaña.
      onAuthStateChange(callback: (event: string, session: { user: AppUser } | null) => void) {
        const handler = async () => {
          try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' })
            const json = await res.json()
            callback('SIGNED_IN', json.user ? { user: json.user } : null)
          } catch {
            callback('SIGNED_OUT', null)
          }
        }
        if (typeof window !== 'undefined') window.addEventListener(AUTH_EVENT, handler)
        return {
          data: {
            subscription: {
              unsubscribe() {
                if (typeof window !== 'undefined') window.removeEventListener(AUTH_EVENT, handler)
              },
            },
          },
        }
      },
    },
  }
}
