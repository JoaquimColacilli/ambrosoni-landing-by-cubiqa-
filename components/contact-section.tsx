"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { brand } from "@/config/brand"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const fieldVariants = (index: number) => ({
    initial: {
      opacity: 0,
      transform: "translateY(15px)",
    },
    whileInView: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: [0.23, 1, 0.32, 1],
        delay: prefersReducedMotion ? 0 : index * 0.06,
      },
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const messageTextarea = document.getElementById("message") as HTMLTextAreaElement
    if (messageTextarea) {
      const handleInput = () => {
        setFormData((prev) => ({ ...prev, message: messageTextarea.value }))
      }
      messageTextarea.addEventListener("input", handleInput)
      return () => messageTextarea.removeEventListener("input", handleInput)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
  }

  return (
    <section id="contacto" ref={sectionRef} className="relative py-24 bg-gradient-to-b from-amber-50/50 to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-6">Contacto</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance text-black">
            Hagamos realidad tu proyecto
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty">
            Nuestro equipo está listo para asesorarte en cada paso
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div
            className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-black">Información de Contacto</h3>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Estamos disponibles para responder todas tus consultas sobre el proyecto. Agendá una visita virtual o
                presencial.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Email</h4>
                  <a href={`mailto:${brand.email}`} className="text-gray-700 hover:text-black transition-colors">
                    {brand.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Teléfono</h4>
                  <a href={`tel:${brand.phones[0].number}`} className="text-gray-700 hover:text-black transition-colors">
                    {brand.phones[0].number}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Oficina</h4>
                  <p className="text-gray-700">
                    {brand.location.address}
                    <br />
                    {brand.location.area}
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg">
              <h4 className="font-semibold mb-3 text-black">Horarios de Atención</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{brand.officeHours.weekdays}</p>
                <p>{brand.officeHours.saturday}</p>
                <p>{brand.officeHours.sunday}</p>
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-50 border border-gray-300 rounded-xl p-8 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                {...fieldVariants(0)}
                viewport={{ once: true }}
              >
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-gray-300 focus:border-black text-gray-900 placeholder:text-gray-500"
                  required
                />
              </motion.div>

              <motion.div
                {...fieldVariants(1)}
                viewport={{ once: true }}
              >
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-gray-300 focus:border-black text-gray-900 placeholder:text-gray-500"
                  required
                />
              </motion.div>

              <motion.div
                {...fieldVariants(2)}
                viewport={{ once: true }}
              >
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-900">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-transparent border-gray-300 focus:border-black text-gray-900 placeholder:text-gray-500"
                  required
                />
              </motion.div>

              <motion.div
                {...fieldVariants(3)}
                viewport={{ once: true }}
              >
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-900">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  placeholder="Contanos sobre tu interés en el proyecto..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-transparent border-gray-300 focus:border-black min-h-32 text-gray-900 placeholder:text-gray-500"
                  required
                />
              </motion.div>

              <Button type="submit" className="w-full bg-[#1a1a1a] text-white hover:bg-gray-800 active:scale-[0.97] transition-transform duration-100" size="lg">
                Enviar Consulta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
