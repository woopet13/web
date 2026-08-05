import { NextRequest, NextResponse } from 'next/server'
import { sendMail, ADMIN_EMAIL, contactEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, asunto, mensaje } = await req.json()

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan datos (nombre, email y mensaje).' }, { status: 400 })
    }
    if (!ADMIN_EMAIL) {
      return NextResponse.json({ error: 'El correo no está configurado.' }, { status: 500 })
    }

    const ok = await sendMail({
      to: ADMIN_EMAIL,
      replyTo: `${nombre} <${email}>`,
      ...contactEmail({ nombre, email, asunto: asunto ?? '', mensaje }),
    })

    if (!ok) return NextResponse.json({ error: 'No se pudo enviar el mensaje.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 })
  }
}
