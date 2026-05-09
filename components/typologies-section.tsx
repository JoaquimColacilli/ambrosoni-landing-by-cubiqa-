"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Bed,
  Bath,
  Car,
  ChefHat,
  Download,
  Maximize,
  Square,
  type LucideIcon,
} from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { motion, AnimatePresence } from "framer-motion"
import SplitType from "split-type"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { brand, type Typology } from "@/config/brand"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { WarmMesh } from "@/components/ui/warm-mesh"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

const iconMap: Record<string, LucideIcon> = { Bed, Bath, Car, ChefHat }

// Card body shared by the touch/desktop variants of the lightbox: plano a la
// izquierda + ficha de tipología a la derecha (stacked en mobile).
function TypologyDetailCard({
  typology,
  onClose,
  onPrev,
  onNext,
}: {
  typology: Typology
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black hover:bg-gray-800 text-white transition-colors z-20 p-2 rounded-full shadow-md"
        aria-label="Cerrar"
      >
        <X size={18} />
      </button>

      {/* Plano */}
      <div className="relative bg-gray-50 lg:w-3/5 aspect-[4/3] lg:aspect-auto lg:min-h-[520px] flex-shrink-0">
        <Image
          src={typology.planImage || "/placeholder.svg"}
          alt={`Plano de tipología ${typology.name}, ${typology.coveredArea}m² cubiertos`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain p-8 lg:p-14"
          priority
        />

        <button
          onClick={onPrev}
          className="absolute top-1/2 left-2 lg:left-3 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2.5 rounded-full shadow-lg active:scale-95 transition-all z-10"
          aria-label="Tipología anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          className="absolute top-1/2 right-2 lg:right-3 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2.5 rounded-full shadow-lg active:scale-95 transition-all z-10"
          aria-label="Tipología siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="lg:w-2/5 p-6 lg:p-10 flex flex-col gap-5 overflow-y-auto">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
            Tipología
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold text-black mt-2 leading-tight">
            {typology.name}
          </h3>
        </div>

        <div className="bg-gray-100 rounded-xl px-5 py-4 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-black">{typology.coveredArea} m²</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            cubiertos
          </span>
          <span className="text-gray-400 text-xl mx-1">+</span>
          <span className="text-2xl font-bold text-black">{typology.uncoveredArea} m²</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            semicubierto
          </span>
        </div>

        {typology.description && (
          <p className="text-sm text-gray-700 leading-relaxed">{typology.description}</p>
        )}

        {typology.features && typology.features.length > 0 && (
          <div className="border-t border-gray-200 pt-5 space-y-3.5">
            {typology.features.map((feature, i) => {
              const Icon = iconMap[feature.iconName]
              return (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon size={16} className="text-gray-600" />}
                  </div>
                  <span>{feature.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function TypologiesSection() {
  const [selectedTypology, setSelectedTypology] = useState<Typology | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const carouselWrapperRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotionHook = useReducedMotion()

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
        const paragraph = headerRef.current.querySelector<HTMLParagraphElement>("p")

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

        if (paragraph) {
          headerTl.fromTo(
            paragraph,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              ease: "power3.out",
            },
            reduced ? 0 : 0.85,
          )
        }
      }

      // ----------------------------------------------------------
      // CAROUSEL — cards stagger horizontal desde derecha
      // ----------------------------------------------------------
      if (carouselWrapperRef.current) {
        const cards = carouselWrapperRef.current.querySelectorAll<HTMLElement>("[data-typology-card]")
        const navButtons = carouselWrapperRef.current.querySelectorAll<HTMLElement>("[data-nav-btn]")

        const carouselTl = gsap.timeline({
          scrollTrigger: {
            trigger: carouselWrapperRef.current,
            start: "top 78%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        if (cards.length > 0) {
          carouselTl.fromTo(
            cards,
            {
              opacity: 0,
              x: 80,
              scale: 0.92,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: reduced ? 0 : 0.9,
              stagger: 0.12,
              ease: "expo.out",
            },
            0,
          )
        }

        if (navButtons.length > 0) {
          carouselTl.fromTo(
            navButtons,
            {
              opacity: 0,
              scale: 0.5,
            },
            {
              opacity: 1,
              scale: 1,
              duration: reduced ? 0 : 0.6,
              ease: "back.out(1.8)",
            },
            reduced ? 0 : 0.7,
          )
        }
      }

      // ----------------------------------------------------------
      // DOTS — fade in stagger
      // ----------------------------------------------------------
      if (dotsRef.current) {
        const dots = dotsRef.current.querySelectorAll<HTMLElement>("button")
        if (dots.length > 0) {
          gsap.fromTo(
            dots,
            {
              opacity: 0,
              scale: 0.5,
            },
            {
              opacity: 1,
              scale: 1,
              duration: reduced ? 0 : 0.5,
              stagger: 0.08,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: dotsRef.current,
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

  // Touch-only CSS reveal (header fade-up + carousel wrapper scale-in).
  useScrollReveal(sectionRef)

  const openLightbox = (typology: Typology) => {
    setSelectedTypology(typology)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedTypology(null)
    // Touch: restore overflow immediately (no exit animation).
    // Desktop: restored in AnimatePresence onExitComplete to avoid scroll during fade-out.
    if (isTouchDevice()) document.body.style.overflow = "unset"
  }

  const cycleTypology = useCallback((direction: 1 | -1) => {
    setSelectedTypology((current) => {
      if (!current) return current
      const i = brand.typologies.findIndex((t) => t.id === current.id)
      if (i === -1) return current
      const len = brand.typologies.length
      const nextIndex = (i + direction + len) % len
      return brand.typologies[nextIndex]
    })
  }, [])

  const showPrevTypology = useCallback(() => cycleTypology(-1), [cycleTypology])
  const showNextTypology = useCallback(() => cycleTypology(1), [cycleTypology])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTypology) return
      if (e.key === "Escape") closeLightbox()
      else if (e.key === "ArrowLeft") showPrevTypology()
      else if (e.key === "ArrowRight") showNextTypology()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedTypology, showPrevTypology, showNextTypology])

  const scrollSnaps = emblaApi?.scrollSnapList() ?? []

  return (
    <section id="tipologias" ref={sectionRef} className="relative py-16 bg-gray-50 overflow-hidden">
      <WarmMesh variant="b" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div ref={headerRef} className="text-center mb-16" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            data-reveal="fade-up"
            className="text-black text-sm font-semibold tracking-wider uppercase"
          >
            Tipologías
          </span>
          <h2
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black"
          >
            Conocé las <span className="text-black">unidades</span>
          </h2>
          <p
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty"
          >
            Descubrí las tipologías disponibles en {brand.project}
          </p>
        </div>

        <div ref={carouselWrapperRef} data-reveal="scale-in" className="relative">
          {/* Carousel — mx leaves a gutter at each side of the viewport so the
              nav arrows have breathing room outside the card area. py adds
              vertical breathing room so card shadow/border isn't clipped. */}
          <div className="overflow-hidden mx-12 lg:mx-16 py-2" ref={emblaRef}>
            <div className="flex -ml-4">
              {brand.typologies.map((typology) => (
                <div
                  key={typology.id}
                  data-typology-card
                  className="flex-none basis-full md:basis-1/2 lg:basis-1/2 pl-4 will-change-transform"
                >
                  <SpotlightCard className="bg-white border border-gray-300 rounded-xl">
                    {/* Plan Image */}
                    <div
                      data-plan-image
                      className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-white"
                      onClick={() => openLightbox(typology)}
                    >
                      <Image
                        src={typology.planImage || "/placeholder.svg"}
                        alt={`Plano de tipología ${typology.name}, ${typology.coveredArea}m² cubiertos`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Maximize className="text-white" size={18} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 pt-6 pb-7">
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

          {/* Navigation Buttons — vertically centered on the wrapper (full
              card), positioned in the mx gutter outside the carousel viewport. */}
          <button
            data-nav-btn
            onClick={scrollPrev}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-lg hidden md:flex items-center justify-center z-10"
            aria-label="Tipología anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            data-nav-btn
            onClick={scrollNext}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-lg hidden md:flex items-center justify-center z-10"
            aria-label="Tipología siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div ref={dotsRef} className="flex justify-center gap-2 mt-8">
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

        <div
          data-reveal="fade-up"
          style={{ ["--reveal-delay" as string]: "200ms" }}
          className="mt-12 flex justify-center"
        >
          <a
            href={brand.brochure.url}
            download={brand.brochure.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 active:scale-[0.97] transition-all shadow-md"
          >
            <Download size={18} />
            {brand.brochure.label} completo
          </a>
        </div>
      </div>

      {/* Lightbox Modal — touch: instant show/hide (no JS ticker during
           image decode); desktop: framer-motion animated entry/exit. */}
      {isTouchDevice() ? (
        selectedTypology && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] overflow-y-auto"
            onClick={closeLightbox}
          >
            <div className="min-h-full flex items-center justify-center p-4 lg:p-8">
              <div className="w-full flex justify-center">
                <TypologyDetailCard
                  typology={selectedTypology}
                  onClose={closeLightbox}
                  onPrev={showPrevTypology}
                  onNext={showNextTypology}
                />
              </div>
            </div>
          </div>
        )
      ) : (
        <AnimatePresence onExitComplete={() => { document.body.style.overflow = "unset" }}>
          {selectedTypology && (
            <motion.div
              key="typologies-lightbox"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: prefersReducedMotionHook ? 0 : 0.2,
                  ease: [0.23, 1, 0.32, 1],
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: prefersReducedMotionHook ? 0 : 0.18,
                  ease: [0.23, 1, 0.32, 1],
                },
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] overflow-y-auto"
              onClick={closeLightbox}
            >
              <div className="min-h-full flex items-center justify-center p-4 lg:p-8">
                <motion.div
                  initial={{ opacity: 0, transform: "scale(0.96)" }}
                  animate={{
                    opacity: 1,
                    transform: "scale(1)",
                    transition: {
                      duration: prefersReducedMotionHook ? 0 : 0.25,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transform: "scale(0.98)",
                    transition: {
                      duration: prefersReducedMotionHook ? 0 : 0.15,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  }}
                  className="w-full flex justify-center"
                >
                  <TypologyDetailCard
                    typology={selectedTypology}
                    onClose={closeLightbox}
                    onPrev={showPrevTypology}
                    onNext={showNextTypology}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
