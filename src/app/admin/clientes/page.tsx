import { getCustomers } from '@/lib/customers-db'
import ClientesTable, { type Cliente } from './ClientesTable'

export const dynamic = 'force-dynamic'

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
        <ClientesTable clientes={clientes as Cliente[]} />
      )}
    </div>
  )
}
