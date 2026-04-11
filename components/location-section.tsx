"use client"

import { useRef } from "react"
import { MapPin, Clock, Car, Train, type LucideIcon } from "lucide-react"
import SplitType from "split-type"
import { brand } from "@/config/brand"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsapConfig"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { GlobePolaroids } from "@/components/ui/cobe-globe-polaroids"

const iconMap: Record<string, LucideIcon> = { MapPin, Car, Train }

export function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const poisWrapperRef = useRef<HTMLDivElement>(null)
  const poisHeadingRef = useRef<HTMLHeadingElement>(null)
  const addressRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
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
      // MAP — clip-path reveal desde abajo hacia arriba
      // ----------------------------------------------------------
      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            opacity: 0,
            scale: 0.96,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 1.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mapRef.current,
              start: "top 80%",
              once: true,
            },
          },
        )
      }

      // ----------------------------------------------------------
      // POIs WRAPPER — heading + cards stagger
      // ----------------------------------------------------------
      if (poisWrapperRef.current) {
        const poiTl = gsap.timeline({
          scrollTrigger: {
            trigger: poisWrapperRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        if (poisHeadingRef.current) {
          poiTl.fromTo(
            poisHeadingRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: reduced ? 0 : 0.8 },
            0,
          )
        }

        const poiCards = poisWrapperRef.current.querySelectorAll<HTMLElement>("[data-poi-card]")
        if (poiCards.length > 0) {
          poiTl.fromTo(
            poiCards,
            {
              opacity: 0,
              x: -30,
              scale: 0.95,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: reduced ? 0 : 0.7,
              stagger: 0.1,
              ease: "power3.out",
            },
            reduced ? 0 : 0.3,
          )
        }

        if (addressRef.current) {
          poiTl.fromTo(
            addressRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 0.7,
              ease: "power3.out",
            },
            reduced ? 0 : 0.9,
          )
        }
      }

      // ----------------------------------------------------------
      // GLOBE — fade + scale in cuando la section entra al viewport
      // ----------------------------------------------------------
      if (globeRef.current) {
        gsap.fromTo(
          globeRef.current,
          {
            opacity: 0,
            scale: 0.7,
          },
          {
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          },
        )
      }
    },
    { scope: sectionRef },
  )

  return (
    <section id="ubicacion" ref={sectionRef} className="relative py-16 bg-gray-50 overflow-hidden">
      <div
        ref={globeRef}
        className="absolute -right-32 -bottom-24 lg:-right-40 lg:-bottom-32 w-[560px] lg:w-[720px] will-change-transform"
        aria-hidden="true"
      >
        <GlobePolaroids />
      </div>
      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            className="text-black text-sm font-semibold tracking-wider uppercase"
          >
            Ubicación
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black">
            En el corazón de <span className="text-black">todo</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty">
            Conectividad premium en la zona más exclusiva de la ciudad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div
            ref={mapRef}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 will-change-transform"
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
          <div ref={poisWrapperRef} className="space-y-6">
            <h3 ref={poisHeadingRef} className="text-2xl font-bold mb-8 text-black">
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
              ref={addressRef}
              className="mt-12 p-6 bg-white border border-gray-300 rounded-lg"
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
