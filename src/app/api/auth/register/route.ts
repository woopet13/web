import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { hashPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, full_name } = await req.json().catch(() => ({}))

  if (!email || !password) {
    return NextResponse.json({ error: { message: 'Email y contraseña requeridos' } }, { status: 400 })
  }
  if (String(password).length < 6) {
    return NextResponse.json(
      { error: { message: 'La contraseña debe tener al menos 6 caracteres.' } },
      { status: 400 },
    )
  }

  const normalizedEmail = String(email).toLowerCase().trim()

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail])
  if (existing.rows.length > 0) {
    // Mensaje que la página de registro reconoce para su texto amigable.
    return NextResponse.json({ error: { message: 'User already registered' } }, { status: 400 })
  }

  const hash = hashPassword(password)
  const { rows } = await pool.query(
    'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email',
    [normalizedEmail, hash, full_name ?? null],
  )
  const user = rows[0]

  // Auto-login: dejamos la sesión iniciada al registrarse.
  const token = await createSessionToken({ id: user.id, email: user.email })
  const res = NextResponse.json({ user: { id: user.id, email: user.email } })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
}
