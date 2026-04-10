"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { brand } from "@/config/brand"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useMagnetic } from "@/hooks/use-magnetic"

export function WhatsAppButton() {
  const prefersReducedMotion = useReducedMotion()
  // Magnetic hook applied to the wrapper div so it doesn't conflict with
  // Framer Motion's transform (scale) on the inner motion.button.
  // Two nested transforms: wrapper translates (magnetic), button scales (Framer).
  const magnetic = useMagnetic<HTMLDivElement>({ strength: 0.35, radius: 100 })

  const handleClick = () => {
    const phoneNumber = brand.whatsapp.number
    const message = encodeURIComponent(brand.whatsapp.message)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <div
      ref={magnetic.ref}
      onMouseMove={magnetic.handleMouseMove}
      onMouseLeave={magnetic.handleMouseLeave}
      className="fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-out"
    >
      <motion.button
        onClick={handleClick}
        className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
        initial={
          prefersReducedMotion
            ? { opacity: 1, transform: "scale(1)" }
            : { opacity: 0, transform: "scale(0.5)" }
        }
        animate={{ opacity: 1, transform: "scale(1)" }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                delay: 1.5,
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }
        }
        whileHover={
          prefersReducedMotion
            ? {}
            : {
                transform: "scale(1.05)",
                transition: { delay: 0, duration: 0.15, ease: "easeOut" },
              }
        }
      >
        <Image
          src="/wsp-logo.png"
          alt="WhatsApp"
          width={64}
          height={64}
          className="rounded-full"
        />
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {brand.cta.whatsapp}
        </span>
      </motion.button>
    </div>
  )
}
