'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatus } from './actions'

const STATUS_LABELS = {
  pending: 'Pendiente',
  processing: 'En proceso',
  completed: 'Completado',
  cancelled: 'Cancelado',
} as const

type Status = keyof typeof STATUS_LABELS
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string
  status: string
}) {
  const [value, setValue] = useState(status)
  const [pending, startTransition] = useTransition()

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    const prev = value
    setValue(next)
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, next as Status)
      if (res?.error) {
        setValue(prev)
        alert(`No se pudo actualizar el estado: ${res.error}`)
      }
    })
  }

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={pending}
      className={`text-xs px-3 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4FB0AB] disabled:opacity-60 ${STATUS_COLORS[value] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {Object.entries(STATUS_LABELS).map(([val, label]) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  )
}
