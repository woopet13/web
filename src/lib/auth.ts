import 'server-only'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { pool } from './db'

export type Role = 'admin' | 'manager' | null

export const SESSION_COOKIE = 'cf_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 días

export interface SessionUser {
  id: string
  email: string
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('Falta SESSION_SECRET en el entorno')
  return new TextEncoder().encode(secret)
}

// ---------------- Passwords ----------------
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash)
  } catch {
    return false
  }
}

// ---------------- Sesión (JWT firmado) ----------------
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey())
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    if (!payload.sub || typeof payload.email !== 'string') return null
    return { id: payload.sub, email: payload.email }
  } catch {
    return null
  }
}

// Lee la cookie de sesión (Server Components, Route Handlers, Server Actions)
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

// Rol del usuario de la sesión (lee la base). El ADMIN_EMAIL siempre es 'admin'.
export async function getRole(): Promise<Role> {
  const user = await getSessionUser()
  if (!user) return null
  if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) return 'admin'
  try {
    const { rows } = await pool.query<{ role: string | null }>(
      'SELECT role FROM users WHERE id = $1 LIMIT 1', [user.id],
    )
    const r = rows[0]?.role
    return r === 'admin' || r === 'manager' ? r : null
  } catch {
    return null
  }
}

// Staff = puede entrar al panel (admin o manager). Usado para gatear acciones.
export async function isAdmin(): Promise<boolean> {
  const r = await getRole()
  return r === 'admin' || r === 'manager'
}

// Super-admin: solo el dueño. Gatea la gestión de usuarios.
export async function isSuperAdmin(): Promise<boolean> {
  return (await getRole()) === 'admin'
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE,
  }
}
