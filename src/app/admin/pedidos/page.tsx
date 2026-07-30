import { createClient } from '@/lib/supabase-server'
import OrderStatusSelect from './OrderStatusSelect'

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
        <div className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FFF6EE] border-b border-[#F3E0D5]">
                  <th className="text-left px-5 py-3 font-semibold text-[#155E5B]">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Usuario</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Despacho</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#155E5B]">Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-[#F3E0D5] last:border-0 hover:bg-[#FFF1E8] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#2F7A77]">{order.id.slice(0, 8)}…</td>
                    <td className="px-4 py-4 text-[#155E5B]">{order.user_email ?? '—'}</td>
                    <td className="px-4 py-4 text-[#2F7A77]">
                      {order.shipping_address?.comuna ? (
                        <span className="text-xs">
                          {order.shipping_address.comuna}
                          {order.shipping_cost ? ` · $${order.shipping_cost.toLocaleString('es-CL')}` : ''}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#155E5B]">
                      ${order.total.toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <OrderStatusSelect orderId={order.id} status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-[#2F7A77]">
                      {new Date(order.created_at).toLocaleDateString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
