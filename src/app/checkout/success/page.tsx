import Link from 'next/link'
import { CheckCircle, Clock, XCircle, Storefront, House } from '@phosphor-icons/react/dist/ssr'
import { db } from '@/lib/db'

type View = {
  emoji: string
  Icon: typeof CheckCircle
  color: string
  title: string
  message: string
}

const VIEWS: Record<'completed' | 'pending' | 'cancelled', View> = {
  completed: {
    emoji: '🐾',
    Icon: CheckCircle,
    color: '#4FB0AB',
    title: '¡Pago exitoso!',
    message:
      'Tu pedido fue procesado correctamente. Te enviaremos un correo con los detalles y el seguimiento del despacho. ¡Gracias por confiar en Woopet!',
  },
  pending: {
    emoji: '⏳',
    Icon: Clock,
    color: '#F2A24E',
    title: 'Pago en proceso',
    message:
      'Estamos confirmando tu pago con Flow. Esto puede tardar unos minutos. Te avisaremos por correo apenas se acredite.',
  },
  cancelled: {
    emoji: '😿',
    Icon: XCircle,
    color: '#F0846E',
    title: 'El pago no se completó',
    message:
      'No pudimos confirmar tu pago. No se realizó ningún cargo. Puedes intentarlo nuevamente desde tu carrito.',
  },
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  let status: 'completed' | 'pending' | 'cancelled' = 'pending'
  if (order) {
    const { data } = await db
      .from('orders')
      .select('status')
      .eq('external_reference', order)
      .single()
    const s = data?.status
    if (s === 'completed') status = 'completed'
    else if (s === 'cancelled') status = 'cancelled'
    else status = 'pending'
  }

  const view = VIEWS[status]
  const { Icon } = view

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">{view.emoji}</div>
        <Icon weight="fill" size={64} className="mx-auto mb-5" style={{ color: view.color }} />
        <h1 className="font-display text-3xl font-extrabold text-[#155E5B] mb-3">{view.title}</h1>
        {order && (
          <p className="text-[#2F7A77] text-sm mb-2">
            Orden: <strong>{order}</strong>
          </p>
        )}
        <p className="text-[#2F7A77] mb-8 leading-relaxed">{view.message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/productos"
            className="flex items-center justify-center gap-2 bg-[#F0846E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E0654E] transition-colors"
          >
            <Storefront weight="fill" size={18} />
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border-2 border-[#155E5B] text-[#155E5B] px-8 py-3 rounded-full font-semibold hover:bg-[#155E5B] hover:text-[#FFF6EE] transition-colors"
          >
            <House weight="fill" size={18} />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
