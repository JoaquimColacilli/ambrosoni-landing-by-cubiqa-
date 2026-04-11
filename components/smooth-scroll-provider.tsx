"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, isTouchDevice } from "@/lib/gsapConfig"

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Touch devices (iOS / Android): skip Lenis entirely. iOS has hardware
    // momentum scroll that beats any JS smoothing, and the Lenis wiring
    // (lenis.on("scroll", ScrollTrigger.update) + gsap.ticker.lagSmoothing(0)
    // + RAF loop on the ticker) tanks FPS on Safari iOS under touch scroll.
    // ScrollTrigger falls back to the native window scroller automatically —
    // no scrollerProxy, no extra wiring needed. Any scrub:true parallax in
    // the page is also softened to scrub:0.5 on mobile via getScrubValue().
    if (isTouchDevice()) return

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

    // Refresh ScrollTrigger whenever the document height changes (images
    // loading, canvas mounting, etc.). Without this, trigger points are
    // calculated against a stale DOM and animations never fire.
    const refreshTriggers = () => ScrollTrigger.refresh()
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null
    const scheduleRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout)
      refreshTimeout = setTimeout(refreshTriggers, 100)
    }

    // Refresh on window load (all images decoded)
    if (document.readyState === "complete") {
      scheduleRefresh()
    } else {
      window.addEventListener("load", scheduleRefresh)
    }

    // Refresh on body size changes (canvas mounting, lazy components)
    const resizeObserver = new ResizeObserver(scheduleRefresh)
    resizeObserver.observe(document.body)

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
      if (refreshTimeout) clearTimeout(refreshTimeout)
      window.removeEventListener("load", scheduleRefresh)
      resizeObserver.disconnect()
      mediaQuery.removeEventListener("change", handleChange)
      gsap.ticker.remove(tickerCallback)
      lenis.off("scroll", ScrollTrigger.update as any)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
