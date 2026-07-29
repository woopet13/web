import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: { message: 'Email y contraseña requeridos' } }, { status: 400 })
  }

  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [String(email).toLowerCase().trim()],
  )
  const user = rows[0]

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: { message: 'Email o contraseña incorrectos.' } }, { status: 401 })
  }

  const token = await createSessionToken({ id: user.id, email: user.email })
  const res = NextResponse.json({ user: { id: user.id, email: user.email } })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
}
