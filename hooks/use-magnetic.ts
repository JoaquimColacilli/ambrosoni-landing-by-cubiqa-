"use client"

import { useRef, type MouseEvent, useCallback } from "react"

interface UseMagneticOptions {
  strength?: number
  radius?: number
}

/**
 * useMagnetic — hook que aplica un desplazamiento magnético hacia el cursor
 * cuando este se acerca al elemento dentro del radio configurado.
 * Respeta prefers-reduced-motion: si está activo, los handlers son no-op.
 *
 * Uso:
 *   const { ref, handleMouseMove, handleMouseLeave } = useMagnetic<HTMLButtonElement>({
 *     strength: 0.35,
 *     radius: 100,
 *   })
 *   <button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
 *           className="... transition-transform duration-300 ease-out">
 *     CTA
 *   </button>
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.35,
  radius = 100,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      if (typeof window === "undefined") return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance < radius) {
        const x = deltaX * strength
        const y = deltaY * strength
        ref.current.style.transform = `translate(${x}px, ${y}px)`
      } else {
        ref.current.style.transform = `translate(0px, 0px)`
      }
    },
    [strength, radius],
  )

  const handleMouseLeave = useCallback(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!ref.current) return
    ref.current.style.transform = `translate(0px, 0px)`
  }, [])

  return { ref, handleMouseMove, handleMouseLeave }
}
