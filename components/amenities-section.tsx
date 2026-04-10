"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Waves, Dumbbell, Trees, Users, Car, Shield, Flame, X, Maximize2, type LucideIcon } from "lucide-react"
import Image from "next/image"
import { brand } from "@/config/brand"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const iconMap: Record<string, LucideIcon> = { Waves, Dumbbell, Trees, Users, Car, Shield, Flame }

export function AmenitiesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [energyCount, setEnergyCount] = useState(0)
  const [certificationVisible, setCertificationVisible] = useState(false)
  const [selectedAmenityIndex, setSelectedAmenityIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const sustainableRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let count = 0
          const interval = setInterval(() => {
            count += 2
            if (count >= 100) {
              count = 100
              clearInterval(interval)
            }
            setEnergyCount(count)
          }, 20)

          setTimeout(() => {
            setCertificationVisible(true)
          }, 500)
        }
      },
      { threshold: 0.5 },
    )

    if (sustainableRef.current) {
      observer.observe(sustainableRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const openModal = (index: number) => {
    setSelectedAmenityIndex(index)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedAmenityIndex(null)
    document.body.style.overflow = "unset"
  }

  const nextAmenity = () => {
    if (selectedAmenityIndex !== null) {
      setSelectedAmenityIndex((selectedAmenityIndex + 1) % brand.amenities.length)
    }
  }

  const prevAmenity = () => {
    if (selectedAmenityIndex !== null) {
      setSelectedAmenityIndex((selectedAmenityIndex - 1 + brand.amenities.length) % brand.amenities.length)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedAmenityIndex === null) return
      if (e.key === "Escape") closeModal()
      if (e.key === "ArrowRight") nextAmenity()
      if (e.key === "ArrowLeft") prevAmenity()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedAmenityIndex])

  return (
    <section id="amenidades" ref={sectionRef} className="relative py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-black text-sm font-semibold tracking-wider uppercase">Amenidades</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black">
            Vivir como <span className="text-black">experiencia</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty">
            Cada detalle pensado para elevar tu calidad de vida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brand.amenities.map((amenity, index) => {
            const Icon = iconMap[amenity.iconName] ?? Shield
            const isHovered = hoveredCard === index

            return (
              <motion.div
                key={index}
                className="relative h-64 cursor-pointer group"
                initial={{ opacity: 0, transform: "translateY(30px)" }}
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { transform: "translateY(-4px)", transition: { duration: 0.2, ease: "easeOut" } }
                }
                viewport={{ once: true }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.5,
                  ease: [0.23, 1, 0.32, 1],
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => openModal(index)}
              >
                <SpotlightCard className="w-full h-full rounded-xl">
                  <div className="relative w-full h-64 transition-transform duration-300 group-hover:scale-105">
                    <Image src={amenity.image || "/placeholder.svg"} alt={amenity.title} fill className="object-cover" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ${isHovered ? "from-black/90 via-black/50" : ""}`}
                    />

                    <div
                      className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                    >
                      <Maximize2 className="text-white" size={20} />
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col items-center justify-end text-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">{amenity.title}</h3>
                      <p className="text-sm text-white/90">{amenity.description}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>

        <div
          ref={sustainableRef}
          className={`mt-16 bg-black text-white rounded-2xl p-12 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Diseño Sustentable</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Cada amenidad fue diseñada con criterios de eficiencia energética y respeto por el medio ambiente,
                combinando lujo con responsabilidad.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">{energyCount}%</div>
                <div className="text-sm text-gray-300">Energía Renovable</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div
                  className={`text-4xl font-bold mb-2 transition-all duration-500 ${certificationVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                >
                  A+
                </div>
                <div className="text-sm text-gray-300">Certificación</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedAmenityIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gray-300 transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
            aria-label="Cerrar"
          >
            <X size={24} className="md:w-8 md:h-8" />
          </button>

          <div
            className="relative w-full max-w-7xl mx-auto flex flex-col h-full max-h-[90vh] justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4 md:mb-6 lg:mb-8 px-4">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                {brand.amenities[selectedAmenityIndex].title}
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-gray-300">
                {brand.amenities[selectedAmenityIndex].description}
              </p>
            </div>

            <div className="relative w-full aspect-[4/3] max-h-[60vh] md:max-h-[70vh] rounded-lg overflow-hidden bg-black">
              <Image
                src={brand.amenities[selectedAmenityIndex].image || "/placeholder.svg"}
                alt={brand.amenities[selectedAmenityIndex].title}
                fill
                className="object-contain"
              />
            </div>

            {brand.amenities.length > 1 && (
              <>
                <button
                  onClick={prevAmenity}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 md:p-3 lg:p-4 rounded-full hover:bg-white/20 transition-all text-xl md:text-2xl font-bold"
                  aria-label="Amenity anterior"
                >
                  ←
                </button>
                <button
                  onClick={nextAmenity}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 md:p-3 lg:p-4 rounded-full hover:bg-white/20 transition-all text-xl md:text-2xl font-bold"
                  aria-label="Siguiente amenity"
                >
                  →
                </button>
              </>
            )}

            <div className="text-center mt-4 md:mt-6 lg:mt-8 text-white">
              <p className="text-base md:text-lg font-medium">
                {selectedAmenityIndex + 1} / {brand.amenities.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
