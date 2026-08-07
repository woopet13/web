import { getSummary, getTopProducts, getMonthlySales, getMonthsWithSales } from '@/lib/finance-db'
import MonthFilter from './MonthFilter'
import { mesLabel } from './months'
import { CurrencyDollar, Receipt, ChartLineUp, Package, Truck } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

const clp = (n: number) => '$' + Math.round(n || 0).toLocaleString('es-CL')

export default async function FinanzasPage({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const { mes } = await searchParams
  const filtro = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : null

  const [summary, top, monthly, months] = await Promise.all([
    getSummary(filtro),
    getTopProducts(filtro, 10),
    getMonthlySales(),
    getMonthsWithSales(),
  ])

  const kpis = [
    { label: 'Ventas totales', value: clp(summary.totalVentas), Icon: CurrencyDollar, color: 'bg-[#4FB0AB]' },
    { label: 'Pedidos pagados', value: String(summary.nPedidos), Icon: Receipt, color: 'bg-[#F0846E]' },
    { label: 'Ticket promedio', value: clp(summary.ticketPromedio), Icon: ChartLineUp, color: 'bg-[#F2A24E]' },
    { label: 'Unidades vendidas', value: String(summary.unidades), Icon: Package, color: 'bg-[#155E5B]' },
    { label: 'Despacho cobrado', value: clp(summary.despachoTotal), Icon: Truck, color: 'bg-[#3FA9A2]' },
  ]

  const maxMonth = Math.max(1, ...monthly.map(m => m.total))
  const maxQty = Math.max(1, ...top.map(t => t.qty))

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#155E5B]">Finanzas</h1>
          <p className="text-[#2F7A77] mt-1">
            {filtro ? `Período: ${mesLabel(filtro)}` : 'Todo el histórico'}
          </p>
        </div>
        <MonthFilter months={months} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#F3E0D5] p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${k.color} flex items-center justify-center mb-3`}>
              <k.Icon weight="fill" size={18} className="text-white" />
            </div>
            <p className="text-2xl font-extrabold text-[#155E5B] leading-none">{k.value}</p>
            <p className="text-xs text-[#2F7A77] mt-1.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución mensual */}
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-6 shadow-sm">
          <h2 className="font-display font-bold text-[#155E5B] text-lg mb-5">Ventas por mes (últimos 12)</h2>
          {monthly.length === 0 ? (
            <p className="text-sm text-[#2F7A77] py-8 text-center">Aún no hay ventas registradas.</p>
          ) : (
            <>
              <div className="flex items-end gap-1.5 h-48">
                {monthly.map(m => (
                  <div
                    key={m.mes}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-[#F0846E] to-[#F2A24E] min-h-[3px] hover:opacity-80 transition-opacity"
                    style={{ height: `${Math.max(2, (m.total / maxMonth) * 100)}%` }}
                    title={`${mesLabel(m.mes)}: ${clp(m.total)} · ${m.n} pedidos`}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                {monthly.map(m => (
                  <span key={m.mes} className="flex-1 text-center text-[10px] text-[#2F7A77]">
                    {m.mes.slice(5)}/{m.mes.slice(2, 4)}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-2xl border border-[#F3E0D5] p-6 shadow-sm">
          <h2 className="font-display font-bold text-[#155E5B] text-lg mb-5">Productos más vendidos</h2>
          {top.length === 0 ? (
            <p className="text-sm text-[#2F7A77] py-8 text-center">Sin datos en este período.</p>
          ) : (
            <div className="space-y-3">
              {top.map((t, i) => (
                <div key={t.name + i}>
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium text-[#155E5B] truncate">
                      <span className="text-[#2F7A77] mr-1.5">{i + 1}.</span>{t.name}
                    </span>
                    <span className="text-xs text-[#2F7A77] shrink-0 whitespace-nowrap">
                      {t.qty} u · <span className="font-semibold text-[#155E5B]">{clp(t.revenue)}</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FFF1E8] overflow-hidden">
                    <div className="h-full rounded-full bg-[#4FB0AB]" style={{ width: `${(t.qty / maxQty) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
