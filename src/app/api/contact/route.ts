import { NextRequest, NextResponse } from 'next/server'
import { sendMail, ADMIN_EMAILS, contactEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, asunto, mensaje } = await req.json()

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan datos (nombre, email y mensaje).' }, { status: 400 })
    }
    if (ADMIN_EMAILS.length === 0) {
      return NextResponse.json({ error: 'El correo no está configurado.' }, { status: 500 })
    }

    const mail = contactEmail({ nombre, email, asunto: asunto ?? '', mensaje })
    const results = await Promise.allSettled(
      ADMIN_EMAILS.map(to => sendMail({ to, replyTo: `${nombre} <${email}>`, ...mail })),
    )
    const ok = results.some(r => r.status === 'fulfilled' && r.value)

    if (!ok) return NextResponse.json({ error: 'No se pudo enviar el mensaje.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 })
  }
}
