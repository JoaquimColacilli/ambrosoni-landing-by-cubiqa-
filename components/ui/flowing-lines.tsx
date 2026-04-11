"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap-utils"

interface FlowingLinesProps {
  className?: string
  lineCount?: number
}

export function FlowingLines({
  className = "",
  lineCount = 14,
}: FlowingLinesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (!svgRef.current || !wrapperRef.current) return

    const ctx = gsap.context(() => {
      const lines = svgRef.current!.querySelectorAll<SVGLineElement>("[data-line]")
      const shimmers = svgRef.current!.querySelectorAll<SVGLineElement>(
        "[data-shimmer]",
      )
      const tickers = svgRef.current!.querySelectorAll<SVGCircleElement>(
        "[data-ticker]",
      )

      // Lines draw-in on enter viewport
      gsap.fromTo(
        lines,
        { strokeDashoffset: (i, el) => el.getTotalLength() },
        {
          strokeDashoffset: 0,
          duration: reduced ? 0 : 1.4,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            once: true,
          },
        },
      )

      // Tickers (dots on intersections) fade in after lines
      gsap.fromTo(
        tickers,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: reduced ? 0 : 0.5,
          stagger: 0.05,
          ease: "back.out(1.8)",
          transformOrigin: "center",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 75%",
            once: true,
          },
        },
      )

      // Shimmer pass — loops slowly on some lines
      if (!reduced) {
        shimmers.forEach((shimmer, i) => {
          gsap.fromTo(
            shimmer,
            { strokeDashoffset: 400 },
            {
              strokeDashoffset: -400,
              duration: 3.5,
              ease: "power2.inOut",
              delay: 2 + i * 1.2,
              repeat: -1,
              repeatDelay: 5,
              scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top 85%",
                toggleActions: "play pause resume pause",
              },
            },
          )
        })
      }
    }, wrapperRef)

    return () => {
      ctx.revert()
    }
  }, [lineCount])

  // Generate line positions and ticker positions
  const lines = Array.from({ length: lineCount }, (_, i) => {
    const y = ((i + 1) / (lineCount + 1)) * 100
    return { id: i, y }
  })

  // Highlight every 3rd line with shimmer
  const shimmerIndices = lines.filter((_, i) => i % 3 === 1).map((l) => l.id)

  // Tickers at random positions along specific lines
  const tickers = [
    { x: 15, y: lines[1]?.y ?? 20 },
    { x: 72, y: lines[1]?.y ?? 20 },
    { x: 42, y: lines[4]?.y ?? 40 },
    { x: 88, y: lines[4]?.y ?? 40 },
    { x: 25, y: lines[7]?.y ?? 60 },
    { x: 65, y: lines[7]?.y ?? 60 },
    { x: 10, y: lines[10]?.y ?? 80 },
    { x: 55, y: lines[10]?.y ?? 80 },
  ]

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {lines.map((line) => (
          <line
            key={`line-${line.id}`}
            data-line
            x1="0"
            y1={`${line.y}%`}
            x2="100%"
            y2={`${line.y}%`}
            stroke="oklch(0.3 0.015 60 / 0.25)"
            strokeWidth="0.6"
            strokeDasharray="2000"
            strokeDashoffset="2000"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Shimmer overlay lines — warm accent, moving highlight */}
        {shimmerIndices.map((id) => {
          const line = lines.find((l) => l.id === id)
          if (!line) return null
          return (
            <line
              key={`shimmer-${id}`}
              data-shimmer
              x1="0"
              y1={`${line.y}%`}
              x2="100%"
              y2={`${line.y}%`}
              stroke="oklch(0.72 0.12 45 / 0.55)"
              strokeWidth="1"
              strokeDasharray="60 340"
              strokeDashoffset="400"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {/* Intersection tickers */}
        {tickers.map((t, i) => (
          <circle
            key={`ticker-${i}`}
            data-ticker
            cx={`${t.x}%`}
            cy={`${t.y}%`}
            r="2.5"
            fill="oklch(0.72 0.12 45 / 0.7)"
          />
        ))}
      </svg>
    </div>
  )
}
