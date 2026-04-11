"use client"

import { useEffect, useRef } from "react"
import createGlobe from "cobe"

interface GlobeProps {
  size?: number
  className?: string
}

export function Globe({ size = 400, className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const phiRef = useRef(0)
  const widthRef = useRef(0)

  useEffect(() => {
    let width = 0
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
        widthRef.current = width
      }
    }
    window.addEventListener("resize", onResize)
    onResize()

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: [0.85, 0.85, 0.85],
      markerColor: [0.95, 0.15, 0.15],
      glowColor: [0.7, 0.7, 0.7],
      markers: [
        // AMBROSONI — Victoria, San Fernando, Buenos Aires
        { location: [-34.45, -58.44], size: 0.12 },
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.005
        }
        state.phi = phiRef.current + pointerInteractionMovement.current
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: 1,
      }}
      onPointerDown={(e) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
      }}
      onPointerUp={() => {
        pointerInteracting.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = "grab"
      }}
      onPointerOut={() => {
        pointerInteracting.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = "grab"
      }}
      onMouseMove={(e) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current
          pointerInteractionMovement.current = delta / 100
        }
      }}
      onTouchMove={(e) => {
        if (pointerInteracting.current !== null && e.touches[0]) {
          const delta = e.touches[0].clientX - pointerInteracting.current
          pointerInteractionMovement.current = delta / 100
        }
      }}
    />
  )
}
