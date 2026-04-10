"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number // 0.1 = subtle, 0.3 = medium, 0.5 = strong
  fill?: boolean
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.15,
  fill = true,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setIsEnabled(false)
      return
    }

    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how far the element is from the center of the viewport
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2
      const distanceFromCenter = elementCenter - viewportCenter
      
      // Only apply parallax when element is in view
      if (rect.bottom > 0 && rect.top < windowHeight) {
        setOffset(distanceFromCenter * speed)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        className="w-full h-full transition-transform duration-100 ease-out"
        style={{
          transform: isEnabled ? `translateY(${offset}px) scale(1.1)` : "scale(1.05)",
        }}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="object-cover w-full h-full"
          />
        )}
      </div>
    </div>
  )
}
