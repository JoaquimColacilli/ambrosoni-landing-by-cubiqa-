"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Bed, Bath, Maximize, Square } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { motion, AnimatePresence } from "framer-motion"
import SplitType from "split-type"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { brand } from "@/config/brand"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { WarmMesh } from "@/components/ui/warm-mesh"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

export function TypologiesSection() {
  const [selectedPlanImage, setSelectedPlanImage] = useState<string | null>(null)
  const [selectedPlanAlt, setSelectedPlanAlt] = useState("")
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

  // Keep nav arrows vertically centered on the plan image area, not on the
  // full card (which includes stats + padding below). Measures the first
  // plan-image wrapper and sets --nav-top on the carousel wrapper.
  useEffect(() => {
    if (!carouselWrapperRef.current) return

    const updateNavTop = () => {
      const wrapper = carouselWrapperRef.current
      if (!wrapper) return
      const firstImage = wrapper.querySelector<HTMLElement>("[data-plan-image]")
      if (!firstImage) return
      const wrapperRect = wrapper.getBoundingClientRect()
      const imageRect = firstImage.getBoundingClientRect()
      const centerY = imageRect.top - wrapperRect.top + imageRect.height / 2
      wrapper.style.setProperty("--nav-top", `${centerY}px`)
    }

    updateNavTop()
    const ro = new ResizeObserver(updateNavTop)
    ro.observe(carouselWrapperRef.current)
    window.addEventListener("resize", updateNavTop)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", updateNavTop)
    }
  }, [])

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

  const openLightbox = (planImage: string, planAlt: string) => {
    setSelectedPlanImage(planImage)
    setSelectedPlanAlt(planAlt)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedPlanImage(null)
    setSelectedPlanAlt("")
    // Touch: restore overflow immediately (no exit animation).
    // Desktop: restored in AnimatePresence onExitComplete to avoid scroll during fade-out.
    if (isTouchDevice()) document.body.style.overflow = "unset"
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
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {brand.typologies.map((typology) => (
                <div
                  key={typology.id}
                  data-typology-card
                  className="flex-none basis-full md:basis-1/2 lg:basis-1/3 pl-4 will-change-transform"
                >
                  <SpotlightCard className="bg-white border border-gray-300 rounded-xl">
                    {/* Plan Image */}
                    <div
                      data-plan-image
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

          {/* Navigation Buttons — centered on the plan image via --nav-top CSS var */}
          <button
            data-nav-btn
            onClick={scrollPrev}
            style={{ top: "var(--nav-top, 50%)" }}
            className="absolute left-0 -translate-y-1/2 -translate-x-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-lg hidden md:flex items-center justify-center z-10"
            aria-label="Tipología anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            data-nav-btn
            onClick={scrollNext}
            style={{ top: "var(--nav-top, 50%)" }}
            className="absolute right-0 -translate-y-1/2 translate-x-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-lg hidden md:flex items-center justify-center z-10"
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
      </div>

      {/* Lightbox Modal — touch: instant show/hide (no JS ticker during
           image decode); desktop: framer-motion animated entry/exit. */}
      {isTouchDevice() ? (
        selectedPlanImage && (
          <div
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
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <AnimatePresence onExitComplete={() => { document.body.style.overflow = "unset" }}>
          {selectedPlanImage && (
            <motion.div
              key="typologies-lightbox"
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
                  duration: prefersReducedMotionHook ? 0 : 0.18,
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
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
