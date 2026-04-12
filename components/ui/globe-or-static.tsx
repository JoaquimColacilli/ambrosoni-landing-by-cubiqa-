"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"

// Lazy-load cobe globe only on desktop — the ~30 kB chunk + canvas RAF
// loop never ships or evaluates on touch devices.
const GlobePolaroids = dynamic(
  () => import("./cobe-globe-polaroids").then((m) => m.GlobePolaroids),
  { ssr: false },
)

// Resolves to true on touch devices, false on desktop, null during SSR /
// first client render (before mount). Using state + effect avoids
// hydration mismatch because both server and first client render produce
// the same output (the fallback / null branch).
function useIsTouch() {
  const [isTouch, setIsTouch] = useState<boolean | null>(null)
  useEffect(() => {
    setIsTouch(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches,
    )
  }, [])
  return isTouch
}

export function GlobeOrStatic({ className = "" }: { className?: string }) {
  const isTouch = useIsTouch()

  // SSR + first client frame: render nothing (parent has opacity:0 via
  // GSAP anyway, so no CLS).
  if (isTouch === null) return null

  if (isTouch) {
    return (
      <div className={`relative aspect-square select-none ${className}`}>
        <Image
          src="/world_png.png"
          alt="Ubicación"
          fill
          className="object-contain opacity-60"
          sizes="(max-width: 1024px) 560px, 720px"
          priority={false}
        />
      </div>
    )
  }

  return <GlobePolaroids className={className} />
}
