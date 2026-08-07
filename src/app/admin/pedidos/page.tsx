import { createClient } from '@/lib/supabase-server'
import PedidosList, { type Order } from './PedidosList'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#155E5B]">Pedidos</h1>
        <p className="text-[#2F7A77] mt-1">{orders?.length ?? 0} pedidos en total</p>
      </div>

      {!orders?.length ? (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-16 text-center text-[#2F7A77]">
          No hay pedidos registrados aún.
        </div>
      ) : (
        <PedidosList orders={orders as Order[]} />
      )}
    </div>
  )
}
