"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { brand } from "@/config/brand"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useMagnetic } from "@/hooks/use-magnetic"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const desktopCtaMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.35, radius: 100 })

  const menuContainerVariants = {
    hidden: {
      transform: "translateX(100%)",
    },
    visible: {
      transform: "translateX(0%)",
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            type: "spring",
            damping: 25,
            stiffness: 300,
          },
    },
    exit: {
      transform: "translateX(100%)",
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4 * 0.4, // 60% faster than enter
          },
    },
  }

  const menuLinkVariants = {
    hidden: {
      opacity: 0,
      transform: "translateX(20px)",
    },
    visible: (i: number) => ({
      opacity: 1,
      transform: "translateX(0px)",
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1],
            delay: i * 0.05,
          },
    }),
    exit: {
      opacity: 0,
      transform: "translateX(20px)",
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.12,
            ease: [0.23, 1, 0.32, 1],
          },
    },
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-[#1a1a1a] backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              <Image src={brand.logo} alt={brand.logoAlt} fill className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              {brand.project}<span className="text-primary">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {brand.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white hover:text-white/80 transition-colors duration-300 relative group font-medium"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div
            ref={desktopCtaMagnetic.ref}
            onMouseMove={desktopCtaMagnetic.handleMouseMove}
            onMouseLeave={desktopCtaMagnetic.handleMouseLeave}
            className="hidden lg:block transition-transform duration-300 ease-out"
          >
            <Button className="bg-white text-black hover:bg-gray-100 active:scale-[0.97] animate-glow-pulse font-semibold">
              {brand.cta.nav}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-background border-t border-border"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {brand.navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-primary transition-colors py-2 font-medium"
                  variants={menuLinkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                variants={menuLinkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={brand.navItems.length}
              >
                <Button className="bg-white text-black hover:bg-gray-100 mt-4 font-semibold w-full">{brand.cta.nav}</Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
