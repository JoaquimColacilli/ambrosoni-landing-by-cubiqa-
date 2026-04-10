"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Bed, Bath, Maximize, Square } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { brand } from "@/config/brand"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export function TypologiesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPlanImage, setSelectedPlanImage] = useState<string | null>(null)
  const [selectedPlanAlt, setSelectedPlanAlt] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

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

  const openLightbox = (planImage: string, planAlt: string) => {
    setSelectedPlanImage(planImage)
    setSelectedPlanAlt(planAlt)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedPlanImage(null)
    setSelectedPlanAlt("")
    // overflow restored in AnimatePresence onExitComplete to avoid scroll during fade-out
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPlanImage) return
      if (e.key === "Escape") closeLightbox()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPlanImage])

  const scrollSnaps = emblaApi?.scrollSnapList() ?? []

  return (
    <section id="tipologias" ref={sectionRef} className="relative py-24 bg-gradient-to-b from-amber-50/30 to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-6">Tipologías</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance text-black">
            Conocé las unidades
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty">
            Descubrí las tipologías disponibles en {brand.project}
          </p>
        </div>

        <div
          className={`relative transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {brand.typologies.map((typology) => (
                <div
                  key={typology.id}
                  className="flex-none basis-full md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <SpotlightCard className="bg-white border border-gray-300 rounded-xl">
                    {/* Plan Image */}
                    <div
                      className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                      onClick={() =>
                        openLightbox(
                          typology.planImage,
                          `Plano de tipología ${typology.name}, ${typology.coveredArea}m² cubiertos`
                        )
                      }
                    >
                      <Image
                        src={typology.planImage || "/placeholder.svg"}
                        alt={`Plano de tipología ${typology.name}, ${typology.coveredArea}m² cubiertos`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Maximize className="text-white" size={18} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-black mb-3">{typology.name}</h3>
                      {typology.description && (
                        <p className="text-sm text-gray-600 mb-4">{typology.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Square size={16} className="text-gray-400" />
                          <span>{typology.totalArea}m² totales</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Maximize size={16} className="text-gray-400" />
                          <span>{typology.coveredArea}m² cubiertos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Bed size={16} className="text-gray-400" />
                          <span>{typology.bedrooms} {typology.bedrooms === 1 ? "dormitorio" : "dormitorios"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Bath size={16} className="text-gray-400" />
                          <span>{typology.bathrooms} {typology.bathrooms === 1 ? "baño" : "baños"}</span>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-lg hidden md:flex items-center justify-center"
            aria-label="Tipología anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-lg hidden md:flex items-center justify-center"
            aria-label="Tipología siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div
          className={`flex justify-center gap-2 mt-8 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 active:scale-95 ${
                index === selectedIndex
                  ? "bg-black scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir a tipología ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal (inline, pattern copied from projects-section) */}
      <AnimatePresence onExitComplete={() => { document.body.style.overflow = "unset" }}>
        {selectedPlanImage && (
          <motion.div
            key="typologies-lightbox"
            initial={{ opacity: 0, transform: "scale(0.96)" }}
            animate={{
              opacity: 1,
              transform: "scale(1)",
              transition: {
                duration: prefersReducedMotion ? 0 : 0.25,
                ease: [0.23, 1, 0.32, 1],
              },
            }}
            exit={{
              opacity: 0,
              transform: "scale(0.98)",
              transition: {
                duration: prefersReducedMotion ? 0 : 0.18,
                ease: [0.23, 1, 0.32, 1],
              },
            }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>

            <div
              className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center py-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedPlanAlt}</h3>
              </div>

              <div className="relative w-full flex-1 max-h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
                  <Image
                    src={selectedPlanImage || "/placeholder.svg"}
                    alt={selectedPlanAlt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
