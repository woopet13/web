import { Truck, ArrowsClockwise, ShieldCheck, Lock, PawPrint } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Envíos, cambios y privacidad | Woopet',
  description: 'Información sobre despachos, cambios y devoluciones, y privacidad en Woopet Pet Shop.',
}

const blocks = [
  {
    Icon: Truck,
    title: 'Envíos y despacho',
    items: [
      'Despacho a todo Chile a través de couriers asociados.',
      'Región Metropolitana: 1 a 3 días hábiles. Regiones: 3 a 7 días hábiles.',
      'Retiro gratis en tienda coordinando por WhatsApp.',
      'El costo de envío se calcula según comuna al finalizar la compra.',
    ],
  },
  {
    Icon: ArrowsClockwise,
    title: 'Cambios y devoluciones',
    items: [
      'Tienes 10 días desde la recepción para solicitar un cambio.',
      'El producto debe estar sellado y en su empaque original.',
      'Por tratarse de alimentos, no se aceptan devoluciones de productos abiertos.',
      'Si el producto llega dañado o con fallas, lo reponemos sin costo.',
    ],
  },
  {
    Icon: ShieldCheck,
    title: 'Calidad y garantía',
    items: [
      'Trabajamos solo con marcas certificadas: Wanpy y Cateko.',
      'Todos los productos cuentan con registro y fecha de vencimiento vigente.',
      'Almacenamiento en condiciones óptimas para conservar la frescura.',
    ],
  },
  {
    Icon: Lock,
    title: 'Privacidad de tus datos',
    items: [
      'Tus datos se usan únicamente para procesar pedidos y despachos.',
      'No compartimos tu información con terceros con fines comerciales.',
      'Los pagos se procesan de forma segura a través de Flow.',
    ],
  },
]

export default function LegalidadPage() {
  return (
    <div className="bg-[#FFF6EE] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#155E5B] via-[#0F4644] to-[#2F7A77] text-[#FFF6EE] py-20 px-4 text-center overflow-hidden">
        <div className="paw-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <p className="text-[#F2A24E] text-xs font-bold tracking-[0.3em] uppercase mb-4">Información útil</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Envíos, cambios y privacidad</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas saber para comprar con confianza en Woopet.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 grid gap-6 md:grid-cols-2">
        {blocks.map(({ Icon, title, items }) => (
          <div key={title} className="bg-white rounded-3xl ring-1 ring-[#F3E0D5] p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F0846E] to-[#F2A24E] flex items-center justify-center shrink-0">
                <Icon weight="fill" size={24} className="text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#155E5B]">{title}</h2>
            </div>
            <ul className="space-y-2.5">
              {items.map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-[#2F7A77] leading-relaxed">
                  <PawPrint weight="fill" size={14} className="text-[#F0846E] mt-0.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
