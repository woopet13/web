import { NextRequest, NextResponse } from 'next/server'
import net from 'node:net'

// Diagnóstico TEMPORAL: IP de salida de Railway + prueba de conexión TCP al
// servidor SMTP. Sirve para pedir el whitelist en el firewall (CSF/cPHulk).
// Borrar tras usar. Protegido con ?k=diag.
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('k') !== 'diag') {
    return NextResponse.json({ error: 'nope' }, { status: 403 })
  }

  // IP de salida (egress) de este servicio en Railway.
  let egressIp = 'desconocida'
  try {
    const r = await fetch('https://api.ipify.org', { signal: AbortSignal.timeout(8000) })
    egressIp = (await r.text()).trim()
  } catch (e) {
    egressIp = 'error: ' + (e as Error).message
  }

  const host = process.env.SMTP_HOST ?? 'mail.woopet.cl'
  const port = Number(process.env.SMTP_PORT ?? 587)

  // Prueba de conexión TCP al SMTP.
  const tcp: { ok: boolean; ms: number; detail: string } = await new Promise(resolve => {
    const start = Date.now()
    const sock = net.connect({ host, port, family: 4 })
    let done = false
    const finish = (ok: boolean, detail: string) => {
      if (done) return
      done = true
      try { sock.destroy() } catch {}
      resolve({ ok, ms: Date.now() - start, detail })
    }
    sock.setTimeout(10000)
    sock.on('connect', () => finish(true, 'conectó'))
    sock.on('timeout', () => finish(false, 'timeout (firewall dropea)'))
    sock.on('error', (err: Error) => finish(false, err.message))
  })

  return NextResponse.json({ egressIp, smtp: { host, port }, tcp })
}
