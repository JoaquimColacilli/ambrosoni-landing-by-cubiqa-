"use client"

import { useCallback, useEffect, useRef, type MouseEvent } from "react"

interface UseMagneticOptions {
  strength?: number
  radius?: number
}

/**
 * useMagnetic — desplazamiento magnético hacia el cursor cuando este se
 * acerca al elemento dentro del radio configurado.
 *
 * Optimizaciones iOS Safari / perf:
 * - No-op en dispositivos sin hover real (hover: none / pointer: coarse) y
 *   con prefers-reduced-motion: reduce. iOS dispara mousemove sintéticos al
 *   tocar; sin este guard, el hook clobberaba el transform que maneja GSAP.
 * - El getBoundingClientRect se lee UNA vez en mouseenter y se cachea. Los
 *   mousemove solo hacen matemática con el rect cacheado, eliminando layout
 *   thrash incluso en desktop.
 * - El write de transform está envuelto en requestAnimationFrame con dedupe
 *   (un solo rAF encolado por vez) — si llegan varios mousemove dentro del
 *   mismo frame, solo se aplica el último.
 *
 * Uso:
 *   const { ref, handleMouseEnter, handleMouseMove, handleMouseLeave } =
 *     useMagnetic<HTMLButtonElement>({ strength: 0.35, radius: 100 })
 *   <button
 *     ref={ref}
 *     onMouseEnter={handleMouseEnter}
 *     onMouseMove={handleMouseMove}
 *     onMouseLeave={handleMouseLeave}
 *     className="... transition-transform duration-300 ease-out"
 *   >CTA</button>
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.35,
  radius = 100,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null)
  const centerRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number | null>(null)
  const disabledRef = useRef(false)

  // Probe capability flags once on mount. Using a ref avoids rerenders and
  // keeps the handler callbacks stable.
  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const noHover = window.matchMedia("(hover: none), (pointer: coarse)").matches
    disabledRef.current = reduce || noHover
  }, [])

  // Cancel any pending rAF on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (disabledRef.current || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      if (disabledRef.current || !ref.current || !centerRef.current) return
      // Dedupe: drop any mousemove that arrives while a rAF is already queued.
      if (rafRef.current !== null) return

      const clientX = e.clientX
      const clientY = e.clientY

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const el = ref.current
        const center = centerRef.current
        if (!el || !center) return

        const dx = clientX - center.x
        const dy = clientY - center.y
        const distance = Math.hypot(dx, dy)

        if (distance < radius) {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
        } else {
          el.style.transform = "translate(0px, 0px)"
        }
      })
    },
    [strength, radius],
  )

  const handleMouseLeave = useCallback(() => {
    if (disabledRef.current || !ref.current) return
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    ref.current.style.transform = "translate(0px, 0px)"
    centerRef.current = null
  }, [])

  return { ref, handleMouseEnter, handleMouseMove, handleMouseLeave }
}
