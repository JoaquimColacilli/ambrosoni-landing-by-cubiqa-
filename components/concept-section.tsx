"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { brand } from "@/config/brand"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function ConceptSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [counts, setCounts] = useState<number[]>(Array(brand.stats.length).fill(0))
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
    if (!isVisible) return

    const animateCounter = (target: number, setter: (val: number) => void, duration = 2000) => {
      const start = 0
      const increment = target / (duration / 16)
      let current = start

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(current))
        }
      }, 16)

      return () => clearInterval(timer)
    }

    const cleanups = brand.stats.map((stat, i) =>
      animateCounter(stat.value, (val) =>
        setCounts((prev) => {
          const next = [...prev]
          next[i] = val
          return next
        }),
      ),
    )

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [isVisible])

  return (
    <section id="concepto" ref={sectionRef} className="relative py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`bg-[#1a1a1a] text-white rounded-2xl p-12 lg:p-16 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              CONVERTIMOS CONCEPTOS EN EXPERIENCIAS
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-pretty">
              Somos un estudio de Arquitectura y visualización con sede en Buenos Aires, Argentina.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Evolution Visualization */}
          <div className="relative">
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="relative aspect-square">
                <div
                  className={`absolute inset-0 transition-all duration-1000 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <img
                    src="/images/design-mode/cbq_gbd_ath_View_10.jpg"
                    alt="Concept Evolution"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-black text-sm font-semibold tracking-wider uppercase">El Concepto</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black gradient-headline">
              De la idea a la experiencia
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-pretty">
              Cada proyecto comienza con una visión. Transformamos bocetos y conceptos arquitectónicos en experiencias
              inmersivas que permiten vivir los espacios antes de su construcción.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed text-pretty">
              Nuestra tecnología de visualización 3D y recorridos virtuales 360° revoluciona la forma en que
              desarrolladores y clientes experimentan la arquitectura moderna.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {brand.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: [0.23, 1, 0.32, 1],
                    delay: prefersReducedMotion ? 0 : i * 0.08,
                  }}
                >
                  <div className="text-3xl font-bold text-black mb-2">{counts[i]}{stat.suffix}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
