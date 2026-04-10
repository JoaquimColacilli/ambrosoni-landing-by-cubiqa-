"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { brand } from "@/config/brand"
import { useMagnetic } from "@/hooks/use-magnetic"
import { HeroParticles } from "@/components/hero-particles"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const primaryMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 100 })
  const secondaryMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 100 })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Curtain Effect */}
      <div
        className={`absolute inset-0 transition-all duration-1500 ${isVisible ? "animate-curtain-open" : "opacity-0"}`}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <img
          src="/images/design-mode/cbq_gbd_ath_View_10.jpg" // TODO: asset AMBROSONI pendiente
          alt="Hero Architecture"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floating particles */}
      <HeroParticles />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div
          className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-balance text-white px-4">
            EXPERIENCIAS
            <br />
            <span className="text-white break-words">ARQUITECTÓNICAS</span>
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-12 animate-fade-in-up text-pretty">
            Convertimos conceptos en realidades inmersivas antes de que existan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              ref={primaryMagnetic.ref}
              onMouseMove={primaryMagnetic.handleMouseMove}
              onMouseLeave={primaryMagnetic.handleMouseLeave}
              href="#experiencia"
              className="group px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 active:scale-[0.97] transition-transform duration-300 ease-out animate-glow-pulse"
            >
              {brand.cta.primary}
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              ref={secondaryMagnetic.ref}
              onMouseMove={secondaryMagnetic.handleMouseMove}
              onMouseLeave={secondaryMagnetic.handleMouseLeave}
              href="#contacto"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black active:scale-[0.97] transition-transform duration-300 ease-out"
            >
              {brand.cta.secondary}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="text-white" size={32} />
      </div>
    </section>
  )
}
