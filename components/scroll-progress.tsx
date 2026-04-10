"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setProgress(scrollPercent)
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-[100] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    >
      <div
        className="h-full transition-transform duration-100 ease-out origin-left"
        style={{
          transform: `scaleX(${progress / 100})`,
          background: "linear-gradient(90deg, #b8860b 0%, #ffd700 50%, #daa520 100%)",
          boxShadow: "0 0 8px rgba(255, 215, 0, 0.6), 0 0 16px rgba(212, 175, 55, 0.4)",
        }}
      />
    </div>
  )
}
