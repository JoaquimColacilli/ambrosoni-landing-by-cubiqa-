"use client"

import { useState, useRef } from "react"
import { Check, X, AlertCircle, Loader2 } from "lucide-react"
import SplitType from "split-type"
import { Button } from "@/components/ui/button"
import { type UnitStatus, type Unit } from "@/config/brand"
import { WarmMesh } from "@/components/ui/warm-mesh"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useUnidades } from "@/hooks/use-unidades"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

const statusConfig: Record<UnitStatus, { label: string; color: string }> = {
  available: { label: "Disponible", color: "bg-primary text-primary-foreground" },
  reserved: { label: "Reservado", color: "bg-gray-200 text-gray-600" },
  consultar: { label: "Consultar", color: "bg-[oklch(0.80_0.05_80)] text-black" },
  sold: { label: "Vendido", color: "bg-muted text-muted-foreground" },
}

export function UnitsSection() {
  const { unidades, loading, error, reintentar } = useUnidades()
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null)
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLDivElement>(null)
  const hasInteracted = useRef(false)

  useGSAP(
    () => {
      if (isTouchDevice()) return
      const reduced = prefersReducedMotion()

      // ----------------------------------------------------------
      // HEADER
      // ----------------------------------------------------------
      if (headerRef.current) {
        const eyebrow = headerRef.current.querySelector<HTMLElement>("[data-eyebrow]")
        const h2 = headerRef.current.querySelector<HTMLHeadingElement>("h2")

        const splitH2 =
          h2 && !reduced ? new SplitType(h2, { types: "words" }) : null

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 78%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        if (eyebrow) {
          headerTl.fromTo(
            eyebrow,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.6 },
            0,
          )
        }

        if (splitH2?.words && splitH2.words.length > 0) {
          headerTl.fromTo(
            splitH2.words,
            { opacity: 0, y: 50, rotateX: -45 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.0,
              stagger: 0.07,
            },
            0.15,
          )
        }
      }

      // ----------------------------------------------------------
      // FILTERS — stagger desde abajo con back ease
      // ----------------------------------------------------------
      if (filtersRef.current) {
        const buttons = filtersRef.current.querySelectorAll("button")
        if (buttons.length > 0) {
          gsap.fromTo(
            buttons,
            {
              opacity: 0,
              y: 30,
              scale: 0.85,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: reduced ? 0 : 0.7,
              ease: "back.out(1.6)",
              stagger: 0.08,
              scrollTrigger: {
                trigger: filtersRef.current,
                start: "top 82%",
                once: true,
              },
            },
          )
        }
      }

      // ----------------------------------------------------------
      // TABLE WRAPPER — clip-path reveal + rows stagger
      // ----------------------------------------------------------
      if (tableWrapperRef.current) {
        const rows = tableWrapperRef.current.querySelectorAll<HTMLElement>("tbody tr")

        const tableTl = gsap.timeline({
          scrollTrigger: {
            trigger: tableWrapperRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // Container reveal
        tableTl.fromTo(
          tableWrapperRef.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 0.97,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 1.1,
            ease: "power3.out",
          },
          0,
        )

        // Rows cascade in
        if (rows.length > 0) {
          tableTl.fromTo(
            rows,
            {
              opacity: 0,
              x: -30,
            },
            {
              opacity: 1,
              x: 0,
              duration: reduced ? 0 : 0.5,
              stagger: 0.06,
              ease: "power2.out",
            },
            reduced ? 0 : 0.4,
          )
        }
      }

      // ----------------------------------------------------------
      // LEGEND — fade in stagger
      // ----------------------------------------------------------
      if (legendRef.current) {
        const items = legendRef.current.querySelectorAll<HTMLElement>("[data-legend-item]")
        if (items.length > 0) {
          gsap.fromTo(
            items,
            {
              opacity: 0,
              y: 15,
            },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 0.5,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: legendRef.current,
                start: "top 90%",
                once: true,
              },
            },
          )
        }
      }
    },
    { scope: sectionRef },
  )

  // Touch-only CSS reveal (header + filters + table wrapper + legend).
  useScrollReveal(sectionRef)

  const handleConsult = (unit: Unit) => {
    const sqmInfo = unit.uncoveredSqm > 0
      ? `${unit.coveredSqm}m² cubiertos + ${unit.uncoveredSqm}m² descubiertos`
      : `${unit.coveredSqm}m² cubiertos`
    const unitInfo = `Piso ${unit.floor}, Unidad ${unit.unit} - ${unit.rooms} ambientes, ${sqmInfo} - ${unit.price}`

    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })

      setTimeout(() => {
        const messageTextarea = document.getElementById("message") as HTMLTextAreaElement
        if (messageTextarea) {
          messageTextarea.value = `Hola, me interesa consultar sobre la unidad ${unitInfo}. Me gustaría recibir más información y coordinar una visita.`
          messageTextarea.dispatchEvent(new Event("input", { bubbles: true }))
        }
      }, 800)
    }
  }

  const filteredUnits = selectedRooms ? unidades.filter((unit) => unit.rooms === selectedRooms) : unidades

  return (
    <section id="unidades" ref={sectionRef} className="relative py-16 bg-gray-50 overflow-hidden">
      <WarmMesh />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div ref={headerRef} className="text-center mb-16" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            data-reveal="fade-up"
            className="text-black text-sm font-semibold tracking-wider uppercase"
          >
            Disponibilidad
          </span>
          <h2
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black"
          >
            Tu espacio <span className="text-black">perfecto</span>
          </h2>
          <div
            data-reveal="reveal-line"
            style={{ ["--reveal-delay" as string]: "180ms" }}
            className="h-px w-16 bg-black/30 mx-auto"
            aria-hidden="true"
          />
        </div>

        <div ref={filtersRef} className="flex justify-center gap-3 mb-12">
          <Button
            data-reveal="fade-up"
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
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
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
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "160ms" }}
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
          ref={tableWrapperRef}
          data-reveal="fade-up"
          style={{ ["--reveal-delay" as string]: "120ms" }}
          className="bg-white border border-gray-300 rounded-xl overflow-hidden will-change-transform"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Piso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unidad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ambientes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sup. cubierta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sup. descubierta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex items-center justify-center gap-3 text-gray-600">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm">Cargando unidades...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle className="text-gray-500" size={24} />
                        <span className="text-sm text-gray-700">No pudimos cargar las unidades.</span>
                        <Button
                          size="sm"
                          onClick={reintentar}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Reintentar
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredUnits.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-sm text-gray-600">
                      No hay unidades que coincidan con el filtro seleccionado.
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredUnits.map((unit, i) => {
                  const unitKey = `${unit.floor}-${unit.unit}-${i}`
                  const status = statusConfig[unit.status]

                  return (
                    <tr
                      key={unitKey}
                      className="border-t border-gray-200 transition-colors duration-300 hover:bg-[oklch(0.92_0.02_80_/_0.08)]"
                      onMouseEnter={() => setHoveredUnit(unitKey)}
                      onMouseLeave={() => setHoveredUnit(null)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{unit.floor}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{unit.unit}</td>
                      <td className="px-6 py-4 text-gray-900">{unit.rooms}</td>
                      <td className="px-6 py-4 text-gray-900">{unit.coveredSqm}m²</td>
                      <td className="px-6 py-4 text-gray-900">
                        {unit.uncoveredSqm > 0 ? `${unit.uncoveredSqm}m²` : "—"}
                      </td>
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
                        {unit.status === "consultar" && (
                          <Button
                            size="sm"
                            onClick={() => handleConsult(unit)}
                            className="bg-[oklch(0.40_0.04_80)] text-white hover:bg-[oklch(0.32_0.04_80)] font-medium cursor-pointer"
                          >
                            Consultar
                          </Button>
                        )}
                        {unit.status === "reserved" && (
                          <Button
                            size="sm"
                            disabled
                            className="bg-gray-200 text-gray-500 font-medium cursor-not-allowed hover:bg-gray-200"
                          >
                            Consultar
                          </Button>
                        )}
                        {unit.status === "sold" && (
                          <Button size="sm" variant="ghost" disabled className="text-gray-500 cursor-not-allowed">
                            <X size={16} className="mr-1" />
                            No Disponible
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div ref={legendRef} className="flex flex-wrap justify-center gap-6 mt-8">
          {Object.entries(statusConfig).map(([key, config], i) => (
            <div
              key={key}
              data-legend-item
              data-reveal="fade-up"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${config.color.split(" ")[0]}`} />
              <span className="text-sm text-gray-600">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
