"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Clock, Car, Train, type LucideIcon } from "lucide-react"
import { brand } from "@/config/brand"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap-utils"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const iconMap: Record<string, LucideIcon> = { MapPin, Car, Train }

export function LocationSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const poisRef = useRef<HTMLDivElement>(null)

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

  // GSAP ScrollTrigger reveal for POI cards
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!poisRef.current) return

    const cards = poisRef.current.querySelectorAll("[data-poi-card]")
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          ease: "power2.out",
          duration: 0.6,
          scrollTrigger: {
            trigger: poisRef.current,
            start: "top 80%",
            once: true,
          },
        },
      )
    }, poisRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="ubicacion" ref={sectionRef} className="relative py-24 bg-gradient-to-b from-gray-50 to-amber-50/40">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold tracking-wider uppercase rounded-full mb-6">Ubicación</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance text-black">
            En el corazón de todo
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty">
            Conectividad premium en la zona más exclusiva de la ciudad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div
            className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <iframe
              src={brand.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-75" />

              </div>
            </div>
          </div>

          {/* Nearby Places */}
          <div ref={poisRef} className="space-y-6">
            <h3
              className={`text-2xl font-bold mb-8 text-black transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              Puntos de Interés
            </h3>
            {brand.nearbyPlaces.map((place, index) => {
              const Icon = iconMap[place.iconName] ?? MapPin
              return (
                <SpotlightCard
                  key={index}
                  className="bg-white border border-gray-300 rounded-lg"
                  spotlightSize={350}
                >
                  <div
                    data-poi-card
                    className="flex items-center gap-4 p-6 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center transition-colors">
                      <Icon className="text-black" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-black">{place.name}</h4>
                      <p className="text-sm text-gray-600">{place.distance}</p>
                    </div>
                    <div className="flex items-center gap-2 text-black">
                      <Clock size={16} />
                      <span className="text-sm font-medium">{place.time}</span>
                    </div>
                  </div>
                </SpotlightCard>
              )
            })}

            {/* Address */}
            <div
              className={`mt-12 p-6 bg-white border border-gray-300 rounded-lg transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <h4 className="font-semibold mb-2 text-black">Dirección</h4>
              <p className="text-gray-700">{brand.location.address}</p>
              <p className="text-gray-700">{brand.location.area + ", " + brand.location.country}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
