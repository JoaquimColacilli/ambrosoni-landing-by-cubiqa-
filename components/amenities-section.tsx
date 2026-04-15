"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Waves, Dumbbell, Trees, Users, Car, Shield, Flame, X, Maximize2, type LucideIcon } from "lucide-react"
import Image from "next/image"
import SplitType from "split-type"
import useEmblaCarousel from "embla-carousel-react"
import { brand } from "@/config/brand"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { DotMatrix } from "@/components/ui/dot-matrix"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, ScrollTrigger, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

const iconMap: Record<string, LucideIcon> = { Waves, Dumbbell, Trees, Users, Car, Shield, Flame }

export function AmenitiesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [energyCount, setEnergyCount] = useState(0)
  const [selectedAmenityIndex, setSelectedAmenityIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Embla carousel for mobile only (rendered inside md:hidden)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  })

  const onCarouselSelect = useCallback(() => {
    if (!emblaApi) return
    setCarouselIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onCarouselSelect()
    emblaApi.on("select", onCarouselSelect)
    return () => { emblaApi.off("select", onCarouselSelect) }
  }, [emblaApi, onCarouselSelect])
  const sustainableRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Touch: CSS reveal + IO counter below drive the mobile entrance.
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
      // GRID — diagonal wave stagger (from.grid utility)
      // ----------------------------------------------------------
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-amenity-card]")
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 50,
              scale: 0.9,
              filter: "blur(8px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              ease: "expo.out",
              stagger: {
                grid: [2, 3],
                from: "start",
                amount: 0.6,
              },
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
                once: true,
              },
            },
          )
        }
      }

      // ----------------------------------------------------------
      // SUSTAINABLE CARD — dark bloque con clip-path + counter
      // ----------------------------------------------------------
      if (sustainableRef.current) {
        const leftSide = sustainableRef.current.querySelector<HTMLElement>("[data-sustain-left]")
        const statBlocks = sustainableRef.current.querySelectorAll<HTMLElement>("[data-sustain-stat]")

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: sustainableRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // Card reveal con clip-path
        cardTl.fromTo(
          sustainableRef.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 0.96,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 1.2,
            ease: "power3.out",
          },
          0,
        )

        // Left side: heading + paragraph
        if (leftSide) {
          const h3 = leftSide.querySelector<HTMLHeadingElement>("h3")
          const p = leftSide.querySelector<HTMLParagraphElement>("p")

          const splitH3 =
            h3 && !reduced ? new SplitType(h3, { types: "words" }) : null

          if (splitH3?.words && splitH3.words.length > 0) {
            cardTl.fromTo(
              splitH3.words,
              { opacity: 0, y: 40, rotateX: -40 },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.9,
                stagger: 0.06,
              },
              reduced ? 0 : 0.5,
            )
          }

          if (p) {
            cardTl.fromTo(
              p,
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

        // Stat blocks (100% Energía + A+ Certificación)
        if (statBlocks.length > 0) {
          cardTl.fromTo(
            statBlocks,
            {
              opacity: 0,
              scale: 0.8,
              y: 30,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: reduced ? 0 : 0.7,
              stagger: 0.15,
              ease: "back.out(1.6)",
            },
            reduced ? 0 : 0.7,
          )
        }

        // Energy counter — GSAP proxy (triggered with the stats reveal)
        ScrollTrigger.create({
          trigger: sustainableRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            const proxy = { val: 0 }
            gsap.to(proxy, {
              val: 100,
              duration: reduced ? 0 : 2.0,
              ease: "power2.out",
              onUpdate: () => setEnergyCount(Math.floor(proxy.val)),
              onComplete: () => setEnergyCount(100),
            })
          },
        })
      }
    },
    { scope: sectionRef },
  )

  // Touch-only CSS reveal (header, sustainable card, stat blocks).
  useScrollReveal(sectionRef)

  // Touch-only energy counter: IntersectionObserver + rAF ease-out-cubic.
  useEffect(() => {
    if (typeof window === "undefined") return
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches
    if (!isTouch) return
    const node = sustainableRef.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setEnergyCount(100)
      return
    }

    let rafId: number | null = null
    let cancelled = false

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(node)
          const start = performance.now()
          const duration = 1800
          const tick = (now: number) => {
            if (cancelled) return
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setEnergyCount(Math.round(100 * eased))
            if (t < 1) rafId = requestAnimationFrame(tick)
            else setEnergyCount(100)
          }
          rafId = requestAnimationFrame(tick)
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    io.observe(node)

    return () => {
      cancelled = true
      if (rafId !== null) cancelAnimationFrame(rafId)
      io.disconnect()
    }
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
    <section id="amenidades" ref={sectionRef} className="relative py-16 bg-gray-50 overflow-hidden">
      <DotMatrix />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div ref={headerRef} className="text-center mb-16" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            data-reveal="fade-up"
            className="text-black text-sm font-semibold tracking-wider uppercase"
          >
            Amenidades
          </span>
          <h2
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black"
          >
            Vivir como <span className="text-black">experiencia</span>
          </h2>
          <p
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty"
          >
            Cada detalle pensado para elevar tu calidad de vida
          </p>
        </div>

        {/* Desktop grid — hidden on mobile */}
        <div ref={gridRef} className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brand.amenities.map((amenity, index) => {
            const Icon = iconMap[amenity.iconName] ?? Shield
            const isHovered = hoveredCard === index

            return (
              <div
                key={index}
                data-amenity-card
                className="relative h-64 cursor-pointer group will-change-transform"
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
              </div>
            )
          })}
        </div>

        {/* Mobile carousel — hidden on md+ */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {brand.amenities.map((amenity, index) => {
                const Icon = iconMap[amenity.iconName] ?? Shield
                return (
                  <div
                    key={index}
                    className="relative h-64 min-w-[85%] flex-shrink-0 cursor-pointer"
                    onClick={() => openModal(index)}
                  >
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <Image src={amenity.image || "/placeholder.svg"} alt={amenity.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col items-center justify-end text-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                          <Icon className="text-white" size={28} />
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-white">{amenity.title}</h3>
                        <p className="text-xs text-white/90">{amenity.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {brand.amenities.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === carouselIndex
                    ? "bg-black scale-110"
                    : "bg-gray-300"
                }`}
                aria-label={`Ir a amenidad ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          ref={sustainableRef}
          data-reveal="fade-up"
          className="mt-16 bg-black text-white rounded-2xl p-12 will-change-transform"
          style={{ perspective: "1000px" }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div data-sustain-left>
              <h3
                data-reveal="fade-up"
                style={{ ["--reveal-delay" as string]: "120ms" }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Diseño Sustentable
              </h3>
              <p
                data-reveal="fade-up"
                style={{ ["--reveal-delay" as string]: "200ms" }}
                className="text-lg text-gray-300 leading-relaxed"
              >
                Cada amenidad fue diseñada con criterios de eficiencia energética y respeto por el medio ambiente,
                combinando lujo con responsabilidad.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div
                data-sustain-stat
                data-reveal="scale-in"
                style={{ ["--reveal-delay" as string]: "280ms" }}
                className="bg-white/10 rounded-lg p-6"
              >
                <div className="text-4xl font-bold mb-2">{energyCount}%</div>
                <div className="text-sm text-gray-300">Energía Renovable</div>
              </div>
              <div
                data-sustain-stat
                data-reveal="scale-in"
                style={{ ["--reveal-delay" as string]: "360ms" }}
                className="bg-white/10 rounded-lg p-6"
              >
                <div className="text-4xl font-bold mb-2">A+</div>
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
