'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { mesLabel } from './months'

export default function MonthFilter({ months }: { months: string[] }) {
  const router = useRouter()
  const current = useSearchParams().get('mes') ?? ''

  return (
    <select
      value={current}
      onChange={e => router.push(e.target.value ? `/admin/finanzas?mes=${e.target.value}` : '/admin/finanzas')}
      className="border border-[#F3E0D5] rounded-full px-4 py-2.5 text-sm bg-white text-[#155E5B] focus:outline-none focus:ring-2 focus:ring-[#F2A24E]"
    >
      <option value="">Todo el histórico</option>
      {months.map(m => <option key={m} value={m}>{mesLabel(m)}</option>)}
    </select>
  )
}
