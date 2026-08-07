import 'server-only'
import nodemailer from 'nodemailer'

// ------------------------------------------------------------
// Correo transaccional (SMTP propio: mail.woopet.cl).
// Todo se configura por variables de entorno. Si faltan, sendMail
// simplemente no envía (no rompe el flujo de pago/contacto).
// ------------------------------------------------------------

const HOST = process.env.SMTP_HOST
const PORT = Number(process.env.SMTP_PORT ?? 465)
const USER = process.env.SMTP_USER
const PASS = process.env.SMTP_PASS
const FROM = process.env.MAIL_FROM ?? (USER ? `Woopet <${USER}>` : undefined)

export const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? USER ?? ''

const globalForMail = globalThis as unknown as { _mailer?: nodemailer.Transporter }

function getTransporter(): nodemailer.Transporter | null {
  if (!HOST || !USER || !PASS) return null
  if (!globalForMail._mailer) {
    const opts: Record<string, unknown> = {
      host: HOST,
      port: PORT,
      secure: PORT === 465, // 465 = SSL directo; 587 = STARTTLS
      auth: { user: USER, pass: PASS },
      // Railway suele resolver el host por IPv6 y colgar la conexión SMTP:
      // forzamos IPv4 para que conecte igual que en local.
      family: 4,
      // Fallar rápido si algo bloquea el SMTP (no colgar la app).
      connectionTimeout: 15000,
      greetingTimeout: 12000,
      socketTimeout: 20000,
    }
    globalForMail._mailer = nodemailer.createTransport(opts as never)
  }
  return globalForMail._mailer
}

// Envío por API HTTP de Resend. Necesario en hosts que bloquean SMTP
// (p.ej. Railway). Se usa si RESEND_API_KEY está definida.
async function sendViaResend(opts: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY!
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM ?? 'Woopet <onboarding@resend.dev>',
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) {
      console.error('[mail] Resend error:', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (err) {
    console.error('[mail] Resend fetch error:', err)
    return false
  }
}

// Envío por relay PHP en el cPanel (send.php). Necesario porque Railway
// bloquea los puertos SMTP salientes; el PHP corre en el mismo servidor de
// correo y envía localmente. Se usa si MAIL_RELAY_URL está definida.
async function sendViaRelay(opts: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  const url = process.env.MAIL_RELAY_URL!
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: process.env.MAIL_RELAY_TOKEN ?? '',
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo ?? '',
        from: FROM,
      }),
      signal: AbortSignal.timeout(12000),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      console.error('[mail] Relay error:', res.status, JSON.stringify(data).slice(0, 200))
      return false
    }
    return true
  } catch (err) {
    console.error('[mail] Relay fetch error:', err)
    return false
  }
}

export async function sendMail(opts: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  if (!opts.to) return false

  // Prioridad: relay PHP (cPanel) → Resend (HTTP) → SMTP directo.
  if (process.env.MAIL_RELAY_URL) {
    return sendViaRelay(opts)
  }
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(opts)
  }

  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[mail] Sin RESEND_API_KEY ni SMTP configurado — no se envía:', opts.subject)
    return false
  }
  try {
    await transporter.sendMail({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    })
    return true
  } catch (err) {
    console.error('[mail] Error al enviar (SMTP):', err)
    return false
  }
}

// ------------------------------------------------------------
// Utilidades de plantilla
// ------------------------------------------------------------
export function clp(n: number): string {
  return '$' + Math.round(n || 0).toLocaleString('es-CL')
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]!))

// Envoltura branded para todos los correos.
export function layout(title: string, body: string): string {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#FFF6EE;font-family:Arial,Helvetica,sans-serif;color:#155E5B">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="text-align:center;padding:8px 0 20px">
      <span style="font-size:22px;font-weight:800;color:#155E5B">🐾 Woopet</span>
    </div>
    <div style="background:#ffffff;border:1px solid #F3E0D5;border-radius:16px;padding:28px">
      <h1 style="margin:0 0 16px;font-size:20px;color:#155E5B">${esc(title)}</h1>
      ${body}
    </div>
    <p style="text-align:center;color:#2F7A77;font-size:12px;margin:20px 0 0">
      Woopet Pet Shop · <a href="https://tienda.woopet.cl" style="color:#F0846E;text-decoration:none">tienda.woopet.cl</a>
    </p>
  </div></body></html>`
}

interface OrderItem {
  name?: string
  price?: number
  quantity?: number
}
interface ShippingAddress {
  name?: string
  phone?: string
  region?: string
  comuna?: string
  address?: string
  reference?: string
}
export interface OrderForEmail {
  external_reference: string
  user_email: string
  items: OrderItem[]
  total: number
  shipping_cost?: number
  shipping_method?: string
  shipping_address?: ShippingAddress | null
}

function itemsTable(items: OrderItem[]): string {
  const rows = (items ?? [])
    .map(
      i => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #F3E0D5">${esc(i.name)} <span style="color:#2F7A77">× ${i.quantity ?? 1}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #F3E0D5;text-align:right;white-space:nowrap">${clp((i.price ?? 0) * (i.quantity ?? 1))}</td>
      </tr>`,
    )
    .join('')
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0">${rows}</table>`
}

function addressBlock(a?: ShippingAddress | null): string {
  if (!a) return ''
  return `<div style="background:#FFF6EE;border-radius:12px;padding:14px;margin:12px 0;font-size:14px;color:#2F7A77">
    <strong style="color:#155E5B">Despacho a:</strong><br>
    ${esc(a.name)} · ${esc(a.phone)}<br>
    ${esc(a.address)}${a.reference ? ', ' + esc(a.reference) : ''}<br>
    ${esc(a.comuna)}, ${esc(a.region)}
  </div>`
}

function totals(o: OrderForEmail): string {
  const subtotal = o.total - (o.shipping_cost ?? 0)
  return `<table style="width:100%;font-size:14px;margin-top:8px">
    <tr><td style="color:#2F7A77">Subtotal</td><td style="text-align:right">${clp(subtotal)}</td></tr>
    <tr><td style="color:#2F7A77">Despacho ${o.shipping_method ? '(' + esc(o.shipping_method) + ')' : ''}</td><td style="text-align:right">${clp(o.shipping_cost ?? 0)}</td></tr>
    <tr><td style="font-weight:800;padding-top:8px">Total</td><td style="text-align:right;font-weight:800;color:#F0846E;padding-top:8px">${clp(o.total)}</td></tr>
  </table>`
}

// Correo al cliente: confirmación de pedido pagado.
export function orderConfirmationEmail(o: OrderForEmail): { subject: string; html: string } {
  const body = `
    <p style="font-size:15px;line-height:1.6">¡Gracias por tu compra! 🐾 Tu pago fue confirmado y estamos preparando tu pedido.</p>
    <p style="font-size:14px;color:#2F7A77">Pedido <strong style="color:#155E5B">${esc(o.external_reference)}</strong></p>
    ${itemsTable(o.items)}
    ${totals(o)}
    ${addressBlock(o.shipping_address)}
    <p style="font-size:13px;color:#2F7A77;margin-top:16px">Te avisaremos cuando tu pedido vaya en camino. ¿Dudas? Responde este correo o escríbenos por WhatsApp.</p>`
  return { subject: `Pedido confirmado ${o.external_reference} · Woopet 🐾`, html: layout('¡Tu pedido está confirmado!', body) }
}

// Correo al admin: nueva venta.
export function adminSaleEmail(o: OrderForEmail): { subject: string; html: string } {
  const body = `
    <p style="font-size:15px">Entró un nuevo pedido pagado.</p>
    <p style="font-size:14px;color:#2F7A77">Pedido <strong style="color:#155E5B">${esc(o.external_reference)}</strong> · Cliente: ${esc(o.user_email)}</p>
    ${itemsTable(o.items)}
    ${totals(o)}
    ${addressBlock(o.shipping_address)}
    <p style="font-size:13px;color:#2F7A77;margin-top:12px"><a href="https://tienda.woopet.cl/admin/pedidos" style="color:#F0846E">Ver en el panel →</a></p>`
  return { subject: `🛒 Nueva venta ${o.external_reference} · ${clp(o.total)}`, html: layout('Nueva venta', body) }
}

// Correo al admin: contacto desde el formulario.
export function contactEmail(d: { nombre: string; email: string; asunto: string; mensaje: string }): {
  subject: string
  html: string
} {
  const body = `
    <p style="font-size:14px;color:#2F7A77">De: <strong style="color:#155E5B">${esc(d.nombre)}</strong> &lt;${esc(d.email)}&gt;</p>
    <p style="font-size:14px;color:#2F7A77">Asunto: ${esc(d.asunto) || '(sin asunto)'}</p>
    <div style="background:#FFF6EE;border-radius:12px;padding:16px;margin-top:8px;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(d.mensaje)}</div>`
  return { subject: `📩 Contacto web: ${esc(d.asunto) || d.nombre}`, html: layout('Nuevo mensaje de contacto', body) }
}

// Correo al admin: stock crítico / agotado tras una venta.
export function lowStockEmail(products: { name: string; stock: number; threshold: number }[]): {
  subject: string
  html: string
} {
  const rows = products
    .map(p => {
      const label = p.stock <= 0 ? 'AGOTADO' : `quedan ${p.stock}`
      const color = p.stock <= 0 ? '#dc2626' : '#B26A1E'
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #F3E0D5">${esc(p.name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #F3E0D5;text-align:right;color:${color};font-weight:700">${label}</td>
      </tr>`
    })
    .join('')
  const body = `
    <p style="font-size:15px">Estos productos llegaron a su stock crítico tras la última venta:</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0">${rows}</table>
    <p style="font-size:13px;color:#2F7A77;margin-top:12px"><a href="https://tienda.woopet.cl/admin/productos" style="color:#F0846E">Reponer en el panel →</a></p>`
  return { subject: `⚠ Stock crítico en ${products.length} producto(s) · Woopet`, html: layout('Alerta de stock', body) }
}
