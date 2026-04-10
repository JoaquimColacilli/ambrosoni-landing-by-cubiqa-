"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Building2, Sparkles, type LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { brand, type GalleryCategory } from "@/config/brand"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const iconMap: Record<string, LucideIcon> = { Building2, Sparkles }

export function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const imageRevealDuration = prefersReducedMotion ? 0 : 0.5
  const imageRevealEasing = [0.23, 1, 0.32, 1] as const
  const staggerDelay = 0.04 // 40ms between images

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
    <section id="proyectos" ref={sectionRef} className="relative py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-black text-sm font-semibold tracking-[0.2em] uppercase">El Proyecto</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mt-6 mb-8 text-balance text-black leading-tight gradient-headline">
            Desarrollos que transforman la forma de vivir
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
            Cada detalle pensado para crear espacios excepcionales que elevan la calidad de vida
          </p>
        </div>

        <div className="space-y-24">
          {brand.gallery.map((category, index) => {
            const Icon = iconMap[category.iconName] ?? Building2
            const isEven = index % 2 === 0

            return (
              <div
                key={category.id}
                className={`transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${300 + index * 200}ms` }}
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                  {/* Image Grid */}
                  <div className={`${!isEven ? "lg:col-start-2" : ""}`}>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Main large image */}
                      <motion.div
                        className="col-span-2"
                        initial={{ opacity: 0, transform: "scale(0.96)" }}
                        whileInView={{ opacity: 1, transform: "scale(1)" }}
                        viewport={{ once: true }}
                        transition={{
                          duration: imageRevealDuration,
                          ease: [...imageRevealEasing],
                          delay: 0 * staggerDelay,
                        }}
                      >
                        <SpotlightCard
                          className="relative aspect-[16/10] rounded-2xl cursor-pointer shadow-xl"
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
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </SpotlightCard>
                      </motion.div>

                      {/* Smaller images */}
                      {category.images.slice(1, 3).map((image, imgIndex) => (
                        <motion.div
                          key={imgIndex}
                          initial={{ opacity: 0, transform: "scale(0.96)" }}
                          whileInView={{ opacity: 1, transform: "scale(1)" }}
                          viewport={{ once: true }}
                          transition={{
                            duration: imageRevealDuration,
                            ease: [...imageRevealEasing],
                            delay: (imgIndex + 1) * staggerDelay,
                          }}
                        >
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
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`space-y-6 ${!isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
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
