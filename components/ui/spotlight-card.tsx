"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
  glowBorder?: boolean
}

/**
 * SpotlightCard — wrapper que aplica spotlight cursor-tracking + border glow.
 * Los efectos respetan prefers-reduced-motion via CSS media query en globals.css.
 * El spotlight layer tiene pointer-events-none para no interferir con clicks internos.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "oklch(0.92 0.02 80 / 0.45)",
  spotlightSize = 500,
  glowBorder = true,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty("--spotlight-x", `${x}px`)
    cardRef.current.style.setProperty("--spotlight-y", `${y}px`)
    cardRef.current.style.setProperty("--spotlight-color", spotlightColor)
    cardRef.current.style.setProperty("--spotlight-size", `${spotlightSize}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight-card group relative overflow-hidden",
        glowBorder && "glow-border",
        className,
      )}
    >
      {/* Spotlight layer — radial gradient seguindo al cursor */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 spotlight-layer"
        style={{
          background:
            "radial-gradient(var(--spotlight-size, 500px) circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color, oklch(0.92 0.02 80 / 0.45)), transparent 45%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}
