"use client"

import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap-utils"

interface GridPatternProps {
  className?: string
}

export function GridPattern({ className = "" }: GridPatternProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const cursorLightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (!wrapperRef.current || !svgRef.current) return

    const ctx = gsap.context(() => {
      // Fade-in the grid itself on enter viewport
      gsap.fromTo(
        svgRef.current,
        { opacity: 0 },
        {
          opacity: 0.5,
          duration: reduced ? 0 : 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            once: true,
          },
        },
      )
    }, wrapperRef)

    // Cursor follow light
    const handleMove = (e: MouseEvent) => {
      if (!wrapperRef.current || !cursorLightRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      if (inside) {
        cursorLightRef.current.style.opacity = "1"
        cursorLightRef.current.style.left = `${x}px`
        cursorLightRef.current.style.top = `${y}px`
      } else {
        cursorLightRef.current.style.opacity = "0"
      }
    }
    window.addEventListener("mousemove", handleMove)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      ctx.revert()
    }
  }, [])

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
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="grid-cells"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="oklch(0.25 0 0)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
          </pattern>
          <pattern
            id="grid-dots"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0" cy="0" r="1.2" fill="oklch(0.72 0.1 45 / 0.5)" />
          </pattern>
          <radialGradient id="cursor-fade" cx="50%" cy="50%">
            <stop offset="0%" stopColor="oklch(0.82 0.08 55 / 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-cells)" />
        <rect width="100%" height="100%" fill="url(#grid-dots)" />
      </svg>

      {/* Cursor-follow warm light */}
      <div
        ref={cursorLightRef}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.08 55 / 0.25) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 300ms ease",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  )
}
