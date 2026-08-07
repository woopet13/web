import { getCustomers } from '@/lib/customers-db'

export const dynamic = 'force-dynamic'

function clp(n: number) {
  return '$' + Math.round(n || 0).toLocaleString('es-CL')
}

export default async function ClientesPage() {
  const clientes = await getCustomers()
  const conCompra = clientes.filter(c => c.pedidos > 0).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#155E5B]">Clientes</h1>
        <p className="text-[#2F7A77] mt-1">
          {clientes.length} cliente{clientes.length === 1 ? '' : 's'} · {conCompra} con compras
        </p>
      </div>

      {clientes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-16 text-center text-[#2F7A77]">
          Aún no hay clientes. Se registran solos cuando alguien compra.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F3E0D5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FFF6EE] border-b border-[#F3E0D5]">
                  <th className="text-left px-5 py-3 font-semibold text-[#155E5B]">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Contacto</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#155E5B]">Comuna</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#155E5B]">Pedidos</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#155E5B]">Total gastado</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id} className="border-b border-[#F3E0D5] last:border-0 hover:bg-[#FFF1E8] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#155E5B]">{c.name || '—'}</div>
                      <div className="text-xs text-[#2F7A77]">{c.email}</div>
                    </td>
                    <td className="px-4 py-4 text-[#2F7A77]">
                      <div>{c.phone || '—'}</div>
                      {c.address && <div className="text-xs">{c.address}</div>}
                    </td>
                    <td className="px-4 py-4 text-[#2F7A77]">{c.comuna || '—'}</td>
                    <td className="px-4 py-4 text-center">
                      {c.pedidos > 0 ? (
                        <span className="inline-block text-xs px-2.5 py-1 rounded-full font-semibold bg-[#4FB0AB]/20 text-[#2F7A77]">
                          {c.pedidos}
                        </span>
                      ) : (
                        <span className="text-xs text-[#2F7A77]/60">sin compras</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#155E5B]">{clp(c.total_gastado)}</td>
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
