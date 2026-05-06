"use client"

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion, isTouchDevice } from "@/lib/gsapConfig"

// AtmosphericLayer — fixed full-page light beams driven by a single GSAP
// ScrollTrigger scrub. Skipped entirely on touch devices: Safari iOS
// recomposes filter:blur + mixBlendMode:multiply on every scroll event, and
// the backing-store readback tanks FPS on iPhone in the sections above the
// fold (hero, concept, immersive). Desktop keeps the full effect.
export function AtmosphericLayer() {
  if (isTouchDevice()) return null

  const wrapperRef = useRef<HTMLDivElement>(null)
  const beam1Ref = useRef<HTMLDivElement>(null)
  const beam2Ref = useRef<HTMLDivElement>(null)
  const beam3Ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(beam1Ref.current, { yPercent: 30, opacity: 0.55 })
        gsap.set(beam2Ref.current, { yPercent: 20, opacity: 0.4 })
        gsap.set(beam3Ref.current, { yPercent: 60, opacity: 0.25 })
        return
      }

      // Mobile uses scrub:0.5 (matches getScrubValue) so the tween lags the
      // scroll event stream — far fewer repaints under native momentum.
      const isMobile = window.matchMedia("(max-width: 768px)").matches
      const scrub = isMobile ? 0.5 : true

      gsap.set(beam1Ref.current, { yPercent: -20, opacity: 0.35 })
      gsap.set(beam2Ref.current, { yPercent: 10, opacity: 0.5 })
      gsap.set(beam3Ref.current, { yPercent: 30, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub,
        },
      })

      // Beam 1 — linear y from -20% to 120%, opacity breathes 0.35→0.5→0.35
      tl.to(beam1Ref.current, { yPercent: 120, duration: 1 }, 0)
      tl.to(beam1Ref.current, { opacity: 0.5, duration: 0.15 }, 0)
      tl.to(beam1Ref.current, { opacity: 0.5, duration: 0.7 }, 0.15)
      tl.to(beam1Ref.current, { opacity: 0.35, duration: 0.15 }, 0.85)

      // Beam 2 — linear y, static opacity
      tl.to(beam2Ref.current, { yPercent: 80, duration: 1 }, 0)

      // Beam 3 — linear y + opacity fade-in that peaks in the lower half
      tl.to(beam3Ref.current, { yPercent: 100, duration: 1 }, 0)
      tl.to(beam3Ref.current, { opacity: 0.15, duration: 0.3 }, 0)
      tl.to(beam3Ref.current, { opacity: 0.28, duration: 0.3 }, 0.3)
      tl.to(beam3Ref.current, { opacity: 0.2, duration: 0.4 }, 0.6)
    },
    { scope: wrapperRef },
  )

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {/* Beam principal — vertical, centrado */}
      <div
        ref={beam1Ref}
        className="absolute left-1/2 -translate-x-1/2 w-[700px] h-[900px]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.80 0.13 135 / 0.55) 0%, oklch(0.83 0.10 135 / 0.22) 40%, transparent 75%)",
          filter: "blur(90px)",
          mixBlendMode: "multiply",
          willChange: "transform, opacity",
        }}
      />

      {/* Beam secundario — off-center izquierda */}
      <div
        ref={beam2Ref}
        className="absolute left-[20%] w-[500px] h-[700px]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.82 0.13 135 / 0.35) 0%, transparent 70%)",
          filter: "blur(110px)",
          mixBlendMode: "multiply",
          willChange: "transform",
        }}
      />

      {/* Beam terciario — lado derecho */}
      <div
        ref={beam3Ref}
        className="absolute right-[15%] w-[550px] h-[750px]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 135 / 0.40) 0%, transparent 70%)",
          filter: "blur(100px)",
          mixBlendMode: "multiply",
          willChange: "transform, opacity",
        }}
      />
    </div>
  )
}
