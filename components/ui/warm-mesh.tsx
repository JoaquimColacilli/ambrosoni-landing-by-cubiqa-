"use client"

import { useRef } from "react"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

interface WarmMeshProps {
  className?: string
  variant?: "a" | "b"
}

const variants = {
  a: `
    radial-gradient(circle 600px at 20% 30%, oklch(0.82 0.08 55 / 0.18) 0%, transparent 60%),
    radial-gradient(circle 500px at 80% 70%, oklch(0.88 0.05 75 / 0.15) 0%, transparent 55%),
    radial-gradient(circle 400px at 50% 90%, oklch(0.78 0.1 45 / 0.12) 0%, transparent 55%)
  `,
  b: `
    radial-gradient(circle 550px at 85% 20%, oklch(0.82 0.08 55 / 0.18) 0%, transparent 60%),
    radial-gradient(circle 620px at 15% 75%, oklch(0.88 0.05 75 / 0.15) 0%, transparent 55%),
    radial-gradient(circle 380px at 60% 45%, oklch(0.78 0.1 45 / 0.1) 0%, transparent 55%)
  `,
}

/**
 * Subtle static warm gradient mesh — three blurred radial blobs in warm tones.
 * No continuous animation, just a fade-in when the section enters the viewport.
 * Designed for sections with dense content that need a calm background accent.
 */
export function WarmMesh({ className = "", variant = "a" }: WarmMeshProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Touch: show immediately (CSS has opacity-0, one-shot gsap.set flips
      // it without creating a ScrollTrigger or any ongoing ticker work).
      if (isTouchDevice()) {
        if (wrapperRef.current) gsap.set(wrapperRef.current, { opacity: 1 })
        return
      }

      const reduced = prefersReducedMotion()
      if (!wrapperRef.current) return

      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: reduced ? 0 : 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            once: true,
          },
        },
      )
    },
    { scope: wrapperRef },
  )

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden opacity-0 ${className}`}
      aria-hidden="true"
      style={{
        background: variants[variant],
      }}
    />
  )
}
