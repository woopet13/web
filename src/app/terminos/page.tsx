import { Scroll } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Términos y condiciones | Woopet',
  description: 'Términos y condiciones de uso y compra en Woopet Pet Shop.',
}

const sections = [
  {
    title: '1. Sobre Woopet',
    body: 'Woopet es una tienda online chilena dedicada a la venta de snacks, alimento y accesorios para perros y gatos, con marcas como Wanpy y Cateko. Al navegar y comprar en este sitio aceptas estos términos y condiciones.',
  },
  {
    title: '2. Productos y precios',
    body: 'Los precios se muestran en pesos chilenos (CLP) e incluyen IVA. Nos reservamos el derecho de modificar precios y disponibilidad sin previo aviso. Las imágenes son referenciales; el empaque puede variar según el lote del fabricante.',
  },
  {
    title: '3. Pedidos y pago',
    body: 'El pago se realiza de forma segura a través de Flow (tarjetas de crédito, débito y transferencia). Un pedido se considera confirmado una vez aprobado el pago. Recibirás un comprobante con el detalle de tu compra.',
  },
  {
    title: '4. Despacho',
    body: 'Realizamos despachos a todo Chile mediante couriers asociados. Los plazos son estimados y pueden variar según la comuna de destino y disponibilidad del courier. También ofrecemos retiro en tienda coordinado por WhatsApp.',
  },
  {
    title: '5. Cambios y devoluciones',
    body: 'Aceptamos cambios dentro de los 10 días posteriores a la recepción, siempre que el producto esté sellado y en su empaque original. Por tratarse de alimentos, no se aceptan devoluciones de productos abiertos. Si el producto llega dañado, lo reponemos sin costo.',
  },
  {
    title: '6. Uso responsable',
    body: 'Los productos deben administrarse según las indicaciones del fabricante y las necesidades de cada mascota. Ante dudas de salud o alimentación, recomendamos consultar con un médico veterinario.',
  },
  {
    title: '7. Contacto',
    body: 'Para cualquier consulta sobre tu pedido o estos términos, escríbenos a hola@woopet.cl o por WhatsApp al +56 9 8419 7351.',
  },
]

export default function TerminosPage() {
  return (
    <div className="bg-[#FFF6EE] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#155E5B] via-[#0F4644] to-[#2F7A77] text-[#FFF6EE] py-20 px-4 text-center overflow-hidden">
        <div className="paw-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Scroll weight="fill" size={28} className="text-[#F2A24E]" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Términos y condiciones</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Las reglas del juego, claras y sin letra chica.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-5">
        {sections.map(s => (
          <div key={s.title} className="bg-white rounded-3xl ring-1 ring-[#F3E0D5] p-7 shadow-sm">
            <h2 className="font-display text-lg font-bold text-[#155E5B] mb-2">{s.title}</h2>
            <p className="text-[#2F7A77] leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
        <p className="text-center text-xs text-[#2F7A77] pt-4">Última actualización: julio 2026</p>
      </div>
    </div>
  )
}
