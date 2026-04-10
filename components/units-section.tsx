"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { brand, type UnitStatus, type Unit } from "@/config/brand"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const statusConfig: Record<UnitStatus, { label: string; color: string }> = {
  available: { label: "Disponible", color: "bg-primary text-primary-foreground" },
  reserved: { label: "Reservado", color: "bg-yellow-500 text-black" },
  sold: { label: "Vendido", color: "bg-muted text-muted-foreground" },
}

export function UnitsSection() {
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null)
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showReservedAlert, setShowReservedAlert] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const hasInteracted = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  const enterDuration = prefersReducedMotion ? 0 : 0.3
  const exitDuration = prefersReducedMotion ? 0 : 0.2

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

  const handleConsult = (unit: Unit) => {
    const unitInfo = `Piso ${unit.floor}, Unidad ${unit.unit} - ${unit.rooms} ambientes, ${unit.sqm}m² - ${unit.price}`

    if (unit.status === "reserved") {
      setShowReservedAlert(`${unit.floor}-${unit.unit}`)
      setTimeout(() => setShowReservedAlert(null), 5000)
    }

    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })

      setTimeout(() => {
        const messageTextarea = document.getElementById("message") as HTMLTextAreaElement
        if (messageTextarea) {
          const message =
            unit.status === "reserved"
              ? `Hola, me interesa consultar sobre la unidad ${unitInfo}. Entiendo que está reservada, pero me gustaría saber si hay posibilidades de disponibilidad o unidades similares.`
              : `Hola, me interesa consultar sobre la unidad ${unitInfo}. Me gustaría recibir más información y coordinar una visita.`
          messageTextarea.value = message
          messageTextarea.dispatchEvent(new Event("input", { bubbles: true }))
        }
      }, 800)
    }
  }

  const filteredUnits = selectedRooms ? brand.units.filter((unit) => unit.rooms === selectedRooms) : brand.units

  return (
    <section id="unidades" ref={sectionRef} className="relative py-24 bg-gradient-to-b from-gray-50 to-amber-50/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-6">Disponibilidad</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance text-black">
            Tu espacio perfecto
          </h2>
        </div>

        <div
          className={`flex justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Button
            variant={selectedRooms === null ? "default" : "outline"}
            onClick={() => { hasInteracted.current = true; setSelectedRooms(null) }}
            className={
              selectedRooms === null
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white border-gray-300 text-black hover:bg-gray-50"
            }
          >
            Todos
          </Button>
          <Button
            variant={selectedRooms === 2 ? "default" : "outline"}
            onClick={() => { hasInteracted.current = true; setSelectedRooms(2) }}
            className={
              selectedRooms === 2
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white border-gray-300 text-black hover:bg-gray-50"
            }
          >
            2 Ambientes
          </Button>
          <Button
            variant={selectedRooms === 3 ? "default" : "outline"}
            onClick={() => { hasInteracted.current = true; setSelectedRooms(3) }}
            className={
              selectedRooms === 3
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white border-gray-300 text-black hover:bg-gray-50"
            }
          >
            3 Ambientes
          </Button>
        </div>

        <div
          className={`bg-white border border-gray-300 rounded-xl overflow-hidden transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Piso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unidad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ambientes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">m²</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acción</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                {filteredUnits.map((unit) => {
                  const unitKey = `${unit.floor}-${unit.unit}`
                  const status = statusConfig[unit.status]
                  const showAlert = showReservedAlert === unitKey

                  return (
                    <motion.tr
                      key={unitKey}
                      initial={hasInteracted.current ? { opacity: 0 } : false}
                      animate={{ opacity: 1, transition: { duration: enterDuration, ease: "easeOut" } }}
                      exit={{ opacity: 0, transition: { duration: exitDuration, ease: "easeOut" } }}
                      className="border-t border-gray-200 transition-colors duration-300 hover:bg-[oklch(0.92_0.02_80_/_0.08)]"
                      onMouseEnter={() => setHoveredUnit(unitKey)}
                      onMouseLeave={() => setHoveredUnit(null)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{unit.floor}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{unit.unit}</td>
                      <td className="px-6 py-4 text-gray-900">{unit.rooms}</td>
                      <td className="px-6 py-4 text-gray-900">{unit.sqm}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{unit.price}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {unit.status === "available" && <Check size={14} />}
                          {unit.status === "sold" && <X size={14} />}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {unit.status === "available" && (
                          <Button
                            size="sm"
                            onClick={() => handleConsult(unit)}
                            className="bg-black text-white hover:bg-gray-800 font-medium cursor-pointer"
                          >
                            Consultar
                          </Button>
                        )}
                        {unit.status === "reserved" && (
                          <div className="relative">
                            <Button
                              size="sm"
                              onClick={() => handleConsult(unit)}
                              className="bg-amber-600 text-white hover:bg-amber-700 font-medium cursor-pointer"
                            >
                              Consultar
                            </Button>
                            {showAlert && (
                              <div className="absolute top-full left-0 mt-2 w-64 z-10">
                                <Alert className="bg-yellow-500/10 border-yellow-500">
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  <AlertDescription className="text-xs text-yellow-500">
                                    Unidad reservada. Te contactaremos para informarte sobre disponibilidad.
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}
                          </div>
                        )}
                        {unit.status === "sold" && (
                          <Button size="sm" variant="ghost" disabled className="text-gray-500 cursor-not-allowed">
                            <X size={16} className="mr-1" />
                            No Disponible
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-6 mt-8 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.color.split(" ")[0]}`} />
              <span className="text-sm text-gray-600">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
