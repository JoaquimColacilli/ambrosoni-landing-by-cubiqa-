"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Building2, Sparkles, type LucideIcon } from "lucide-react"
import SplitType from "split-type"
import { brand, type GalleryCategory } from "@/config/brand"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { GridPattern } from "@/components/ui/grid-pattern"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

const iconMap: Record<string, LucideIcon> = { Building2, Sparkles }

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Entry animations — useGSAP runs pre-paint and auto-reverts the full
  // context (ScrollTriggers included) on unmount.
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
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.7 },
            0,
          )
        }

        if (splitH2?.words && splitH2.words.length > 0) {
          headerTl.fromTo(
            splitH2.words,
            { opacity: 0, y: 60, rotateX: -50 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.0,
              stagger: 0.06,
            },
            0.2,
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
              duration: reduced ? 0 : 0.9,
              ease: "power3.out",
            },
            reduced ? 0 : 0.9,
          )
        }
      }

      // ----------------------------------------------------------
      // CATEGORY BLOCKS — one timeline per block, triggered when
      // the block itself crosses the viewport
      // ----------------------------------------------------------
      const categoryBlocks = sectionRef.current?.querySelectorAll<HTMLElement>(
        "[data-category-block]",
      )

      categoryBlocks?.forEach((block) => {
        const bigImageWrap = block.querySelector<HTMLElement>("[data-img-big]")
        const smallImages = block.querySelectorAll<HTMLElement>("[data-img-small]")
        const textSide = block.querySelector<HTMLElement>("[data-text-side]")
        const badge = textSide?.querySelector<HTMLElement>("[data-category-badge]")
        const h3 = textSide?.querySelector<HTMLHeadingElement>("h3")
        const paragraph = textSide?.querySelector<HTMLParagraphElement>("p")
        const button = textSide?.querySelector<HTMLButtonElement>("button")

        const splitH3 =
          h3 && !reduced ? new SplitType(h3, { types: "words" }) : null

        const blockTl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 75%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // 1. Big image: fade + slight rise (no clip-path — simpler and safer)
        if (bigImageWrap) {
          blockTl.fromTo(
            bigImageWrap,
            {
              opacity: 0,
              y: 40,
            },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 1.0,
              ease: "power3.out",
              clearProps: "transform",
            },
            0,
          )
        }

        // 2. Small images: staggered scale + fade
        if (smallImages.length > 0) {
          blockTl.fromTo(
            smallImages,
            {
              opacity: 0,
              scale: 0.88,
              y: 30,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: reduced ? 0 : 0.9,
              stagger: 0.12,
              ease: "back.out(1.4)",
            },
            reduced ? 0 : 0.3,
          )
        }

        // 3. Text side: badge → h3 words → paragraph → button
        if (badge) {
          blockTl.fromTo(
            badge,
            { opacity: 0, scale: 0.8, y: 15 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: reduced ? 0 : 0.6,
              ease: "back.out(1.6)",
            },
            reduced ? 0 : 0.4,
          )
        }

        if (splitH3?.words && splitH3.words.length > 0) {
          blockTl.fromTo(
            splitH3.words,
            { opacity: 0, y: 40, rotateX: -40 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              stagger: 0.06,
            },
            reduced ? 0 : 0.55,
          )
        }

        if (paragraph) {
          blockTl.fromTo(
            paragraph,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              ease: "power3.out",
            },
            reduced ? 0 : 0.9,
          )
        }

        if (button) {
          blockTl.fromTo(
            button,
            { opacity: 0, y: 20, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: reduced ? 0 : 0.6,
              ease: "back.out(1.6)",
            },
            reduced ? 0 : 1.1,
          )
        }
      })
    },
    { scope: sectionRef },
  )

  // Touch-only CSS reveal for header + alternating slide-in per block.
  useScrollReveal(sectionRef)

  const openModal = (category: GalleryCategory, imageIndex = 0) => {
    setSelectedCategory(category)
    setCurrentImageIndex(imageIndex)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedCategory(null)
    setCurrentImageIndex(0)
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCategory.images.length)
    }
  }

  const prevImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedCategory.images.length) % selectedCategory.images.length)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCategory) return
      if (e.key === "Escape") closeModal()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCategory])

  return (
    <section id="proyectos" ref={sectionRef} className="relative py-24 bg-gray-50 overflow-hidden">
      <GridPattern />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div ref={headerRef} className="text-center mb-20" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            data-reveal="fade-up"
            className="text-black text-sm font-semibold tracking-[0.2em] uppercase"
          >
            El Proyecto
          </span>
          <h2
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mt-6 mb-8 text-balance text-black leading-tight"
          >
            Desarrollos que transforman
            <br />
            la forma de vivir
          </h2>
          <p
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed"
          >
            Cada detalle pensado para crear espacios excepcionales que elevan la calidad de vida
          </p>
        </div>

        <div className="space-y-24">
          {brand.gallery.map((category, index) => {
            const Icon = iconMap[category.iconName] ?? Building2
            const isEven = index % 2 === 0
            // Alternating slide direction per block on touch; desktop uses GSAP.
            const imageReveal = isEven ? "slide-in-left" : "slide-in-right"
            const textReveal = isEven ? "slide-in-right" : "slide-in-left"

            return (
              <div key={category.id} data-category-block>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                  {/* Image Grid */}
                  <div
                    data-reveal={imageReveal}
                    className={`${!isEven ? "lg:col-start-2" : ""}`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Main large image */}
                      <div data-img-big className="col-span-2 will-change-transform">
                        <SpotlightCard
                          className="relative aspect-[16/10] rounded-2xl cursor-pointer shadow-xl overflow-hidden"
                          spotlightSize={400}
                        >
                          <div
                            className="relative w-full h-full group"
                            onClick={() => openModal(category, 0)}
                          >
                            <Image
                              src={category.images[0] || "/placeholder.svg"}
                              alt={`${category.name} - Principal`}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </SpotlightCard>
                      </div>

                      {/* Smaller images */}
                      {category.images.slice(1, 3).map((image, imgIndex) => (
                        <div key={imgIndex} data-img-small className="will-change-transform">
                          <SpotlightCard
                            className="relative aspect-square rounded-xl cursor-pointer shadow-lg"
                            spotlightSize={400}
                          >
                            <div
                              className="relative w-full h-full group"
                              onClick={() => openModal(category, imgIndex + 1)}
                            >
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`${category.name} - ${imgIndex + 2}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </SpotlightCard>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    data-text-side
                    data-reveal={textReveal}
                    style={{ ["--reveal-delay" as string]: "120ms", perspective: "1000px" }}
                    className={`space-y-6 ${!isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}
                  >
                    <div
                      data-category-badge
                      className="inline-flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full"
                    >
                      <Icon size={20} className="text-black" />
                      <span className="text-sm font-semibold tracking-wider uppercase text-black">{category.name}</span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-bold text-black leading-tight">{category.subtitle}</h3>

                    <p className="text-lg text-gray-600 leading-relaxed">{category.description}</p>

                    <button
                      onClick={() => openModal(category, 0)}
                      className="group inline-flex items-center gap-3 mt-6 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span className="font-semibold">Ver Galería Completa</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <button
            onClick={closeModal}
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
              <h3 className="text-2xl font-bold text-white">{selectedCategory.name}</h3>
            </div>

            <div className="relative w-full flex-1 max-h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
                <Image
                  src={selectedCategory.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${selectedCategory.name} - Imagen ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {selectedCategory.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/20 transition-all text-2xl font-bold"
                    aria-label="Imagen anterior"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/20 transition-all text-2xl font-bold"
                    aria-label="Siguiente imagen"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <div className="text-center mt-6 text-white">
              <p className="text-lg font-medium">
                {currentImageIndex + 1} / {selectedCategory.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
