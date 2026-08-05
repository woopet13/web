'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Envelope, WhatsappLogo, PaperPlaneTilt } from '@phosphor-icons/react'

const WHATSAPP_NUMBER = '56984197351'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'No se pudo enviar el mensaje. Intenta por WhatsApp.')
      } else {
        setEnviado(true)
      }
    } catch {
      setError('Error de conexión. Intenta por WhatsApp.')
    }
    setSending(false)
  }

  return (
    <div className="bg-[#FFF6EE] min-h-screen">
      {/* Header */}
      <section className="relative bg-[#155E5B] text-[#FFF6EE] py-24 px-4 text-center overflow-hidden">
        <Image src="/images/hero/hero-contacto.jpg" alt="" fill priority sizes="100vw" className="object-cover hero-kenburns-alt" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#155E5B]/90 via-[#0F4644]/85 to-[#2F7A77]/90" />
        <div className="paw-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10">
          <p className="text-[#F2A24E] text-xs font-bold tracking-[0.3em] uppercase mb-4">Estamos aquí para ayudarte</p>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mb-5">Contáctanos 🐾</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            ¿Tienes dudas sobre pedidos, productos o despachos? ¡Escríbenos, con gusto te ayudamos!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Info de contacto */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#155E5B] mb-6">Información de contacto</h2>
            <p className="text-[#2F7A77] leading-relaxed mb-8">
              Somos un pet shop chileno apasionado por las mascotas. Respondemos consultas de lunes a viernes,
              y también los fines de semana por WhatsApp.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#155E5B] rounded-full flex items-center justify-center shrink-0">
                <MapPin weight="fill" size={20} className="text-[#F2A24E]" />
              </div>
              <div>
                <p className="font-semibold text-[#155E5B]">Ubicación</p>
                <p className="text-[#2F7A77] text-sm">Santiago, Chile</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#155E5B] rounded-full flex items-center justify-center shrink-0">
                <WhatsappLogo weight="fill" size={20} className="text-[#F2A24E]" />
              </div>
              <div>
                <p className="font-semibold text-[#155E5B]">WhatsApp</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F0846E] text-sm hover:underline"
                >
                  +56 9 8419 7351
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#155E5B] rounded-full flex items-center justify-center shrink-0">
                <Envelope weight="fill" size={20} className="text-[#F2A24E]" />
              </div>
              <div>
                <p className="font-semibold text-[#155E5B]">Email</p>
                <a href="mailto:hola@woopet.cl" className="text-[#F0846E] text-sm hover:underline">
                  hola@woopet.cl
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#155E5B] rounded-full flex items-center justify-center shrink-0">
                <Phone weight="fill" size={20} className="text-[#F2A24E]" />
              </div>
              <div>
                <p className="font-semibold text-[#155E5B]">Horario de atención</p>
                <p className="text-[#2F7A77] text-sm">Lun – Vie: 9:00 – 18:00</p>
                <p className="text-[#2F7A77] text-sm">Sáb: 10:00 – 14:00</p>
              </div>
            </div>
          </div>

          {/* CTA WhatsApp directo */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola Woopet! Tengo una consulta 🐾')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1ebe5d] transition-colors shadow-md"
          >
            <WhatsappLogo weight="fill" size={22} />
            Escribir por WhatsApp
          </a>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {enviado ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 bg-[#F2A24E]/20 rounded-full flex items-center justify-center mb-4">
                <PaperPlaneTilt weight="fill" size={32} className="text-[#F2A24E]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#155E5B] mb-2">¡Mensaje enviado!</h3>
              <p className="text-[#2F7A77] mb-6">Te redirigimos a WhatsApp para completar tu consulta.</p>
              <button
                onClick={() => setEnviado(false)}
                className="text-[#F0846E] text-sm hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-[#155E5B] mb-6">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="w-full border border-[#F2A24E]/30 rounded-lg px-4 py-2.5 text-sm bg-[#FFF6EE]/50 focus:outline-none focus:ring-2 focus:ring-[#F2A24E] focus:border-transparent placeholder:text-[#2F7A77]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full border border-[#F2A24E]/30 rounded-lg px-4 py-2.5 text-sm bg-[#FFF6EE]/50 focus:outline-none focus:ring-2 focus:ring-[#F2A24E] focus:border-transparent placeholder:text-[#2F7A77]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Asunto</label>
                  <select
                    name="asunto"
                    required
                    value={form.asunto}
                    onChange={handleChange}
                    className="w-full border border-[#F2A24E]/30 rounded-lg px-4 py-2.5 text-sm bg-[#FFF6EE]/50 focus:outline-none focus:ring-2 focus:ring-[#F2A24E] focus:border-transparent text-[#155E5B]"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="Consulta sobre productos">Consulta sobre productos</option>
                    <option value="Estado de mi pedido">Estado de mi pedido</option>
                    <option value="Despachos y envíos">Despachos y envíos</option>
                    <option value="Ventas mayoristas">Ventas mayoristas</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#155E5B] mb-1.5">Mensaje</label>
                  <textarea
                    name="mensaje"
                    required
                    rows={5}
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Cuéntanos tu consulta..."
                    className="w-full border border-[#F2A24E]/30 rounded-lg px-4 py-2.5 text-sm bg-[#FFF6EE]/50 focus:outline-none focus:ring-2 focus:ring-[#F2A24E] focus:border-transparent resize-none placeholder:text-[#2F7A77]/40"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#F0846E] text-white py-3 rounded-full font-medium hover:bg-[#E0654E] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <PaperPlaneTilt weight="fill" size={18} />
                  {sending ? 'Enviando…' : 'Enviar mensaje'}
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola Woopet! Tengo una consulta 🐾')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-[#F3E0D5] text-[#155E5B] py-2.5 rounded-full font-medium hover:bg-[#FFF1E8] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <WhatsappLogo weight="fill" size={16} className="text-[#25D366]" />
                  O escríbenos por WhatsApp
                </a>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
