"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap-utils"

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
      smoothWheel: !prefersReducedMotion,
    })

    lenisRef.current = lenis

    // Wire Lenis scroll events to ScrollTrigger so GSAP pin/parallax
    // stays in sync with Lenis's smooth scroll position
    lenis.on("scroll", ScrollTrigger.update)

    // Use GSAP ticker as the single RAF driver for Lenis
    // (replaces the manual requestAnimationFrame loop)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Listen for reduced-motion changes in runtime
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (lenisRef.current) {
        lenisRef.current.options.smoothWheel = !e.matches
      }
    }
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      gsap.ticker.remove(tickerCallback)
      lenis.off("scroll", ScrollTrigger.update as any)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
