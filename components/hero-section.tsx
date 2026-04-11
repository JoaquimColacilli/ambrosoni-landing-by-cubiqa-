"use client"

import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import SplitType from "split-type"
import { brand } from "@/config/brand"
import { useMagnetic } from "@/hooks/use-magnetic"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap-utils"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  const primaryMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 100 })
  const secondaryMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 100 })

  useEffect(() => {
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      // Split title into characters
      const splitTitle =
        titleRef.current && !reduced
          ? new SplitType(titleRef.current, { types: "chars,words" })
          : null

      // Entry timeline — plays on mount
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
      })

      // 1. Background image: curtain reveal with clip-path + subtle zoom-out
      if (imageWrapperRef.current) {
        tl.fromTo(
          imageWrapperRef.current,
          {
            clipPath: "inset(0 50% 0 50%)",
            opacity: 0,
          },
          {
            clipPath: "inset(0 0% 0 0%)",
            opacity: 1,
            duration: reduced ? 0 : 1.8,
            ease: "power3.inOut",
          },
          0,
        )
      }
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.2 },
          {
            scale: 1,
            duration: reduced ? 0 : 2.4,
            ease: "power2.out",
          },
          0,
        )
      }

      // 2. Title characters: cascade from below with stagger
      if (splitTitle?.chars && splitTitle.chars.length > 0) {
        tl.fromTo(
          splitTitle.chars,
          {
            yPercent: 120,
            opacity: 0,
            rotateX: -60,
          },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.025,
          },
          0.6,
        )
      } else if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: reduced ? 0 : 0.8 },
          0.6,
        )
      }

      // 3. Subtitle: fade + slight rise
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reduced ? 0 : 1.0,
            ease: "power3.out",
          },
          reduced ? 0 : 1.4,
        )
      }

      // 4. CTAs: scale + fade stagger
      if (ctasRef.current) {
        const buttons = ctasRef.current.querySelectorAll("a")
        if (buttons.length > 0) {
          tl.fromTo(
            buttons,
            { opacity: 0, scale: 0.85, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: reduced ? 0 : 0.7,
              ease: "back.out(1.6)",
              stagger: 0.12,
            },
            reduced ? 0 : 1.7,
          )
        }
      }

      // 5. Scroll indicator: fade in last
      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : 0.8,
            ease: "power2.out",
          },
          reduced ? 0 : 2.2,
        )
      }

      // Scroll-linked effects: parallax + fade-out as user scrolls away from hero
      if (!reduced && sectionRef.current) {
        // Background image parallax (moves slower than scroll)
        if (imageWrapperRef.current) {
          gsap.to(imageWrapperRef.current, {
            yPercent: 25,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
        }

        // Content fades and drifts up as user scrolls past
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            yPercent: -30,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "70% top",
              scrub: true,
            },
          })
        }

        // Scroll indicator fades out quickly
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "20% top",
              scrub: true,
            },
          })
        }
      }
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Image */}
      <div ref={imageWrapperRef} className="absolute inset-0 will-change-transform">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          ref={imageRef}
          src="/images/design-mode/cbq_gbd_ath_View_10.jpg"
          alt="Hero Architecture"
          className="w-full h-full object-cover will-change-transform"
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-20 container mx-auto px-4 text-center">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-balance text-white px-4"
          style={{ perspective: "800px" }}
        >
          EXPERIENCIAS
          <br />
          <span className="text-white break-words">ARQUITECTÓNICAS</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-12 text-pretty"
        >
          Convertimos conceptos en realidades inmersivas antes de que existan
        </p>
        <div
          ref={ctasRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            ref={primaryMagnetic.ref}
            onMouseMove={primaryMagnetic.handleMouseMove}
            onMouseLeave={primaryMagnetic.handleMouseLeave}
            href="#experiencia"
            className="group px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 active:scale-[0.97] transition-transform duration-300 ease-out animate-glow-pulse"
          >
            {brand.cta.primary}
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            ref={secondaryMagnetic.ref}
            onMouseMove={secondaryMagnetic.handleMouseMove}
            onMouseLeave={secondaryMagnetic.handleMouseLeave}
            href="#contacto"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black active:scale-[0.97] transition-transform duration-300 ease-out"
          >
            {brand.cta.secondary}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce"
      >
        <ChevronDown className="text-white" size={32} />
      </div>
    </section>
  )
}
