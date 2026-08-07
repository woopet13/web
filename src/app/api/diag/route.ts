import { NextRequest, NextResponse } from 'next/server'
import net from 'node:net'

// Diagnóstico TEMPORAL de conectividad SMTP. Borrar tras resolver.
function tryConnect(host: string, port: number, timeout = 8000): Promise<{ port: number; ok: boolean; ms: number; detail: string }> {
  return new Promise(resolve => {
    const start = Date.now()
    const sock = net.connect({ host, port })
    let done = false
    const finish = (ok: boolean, detail: string) => {
      if (done) return
      done = true
      try { sock.destroy() } catch {}
      resolve({ port, ok, ms: Date.now() - start, detail })
    }
    sock.setTimeout(timeout)
    sock.on('connect', () => finish(true, 'conectó'))
    sock.on('timeout', () => finish(false, 'timeout'))
    sock.on('error', (err: Error) => finish(false, (err as NodeJS.ErrnoException).code || err.message))
  })
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('k') !== 'diag') {
    return NextResponse.json({ error: 'nope' }, { status: 403 })
  }

  let egressIp = 'desconocida'
  try {
    const r = await fetch('https://api.ipify.org', { signal: AbortSignal.timeout(8000) })
    egressIp = (await r.text()).trim()
  } catch (e) {
    egressIp = 'error: ' + (e as Error).message
  }

  const host = process.env.SMTP_HOST ?? 'mail.woopet.cl'
  // Puertos de correo (587/465/25/993) + cPanel (2083) + web (443) como control.
  const ports = [587, 465, 25, 993, 2083, 443]
  const puertos = await Promise.all(ports.map(p => tryConnect(host, p)))

  // Control: ¿hay salida a internet en general?
  const internet = await tryConnect('google.com', 443)

  return NextResponse.json({ egressIp, host, puertos, internet })
}
