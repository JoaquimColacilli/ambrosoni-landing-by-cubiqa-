"use client"

import { useRef } from "react"
import { ChevronDown } from "lucide-react"
import SplitType from "split-type"
import { brand } from "@/config/brand"
import { useMagnetic } from "@/hooks/use-magnetic"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, getScrubValue, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  const primaryMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 100 })
  const secondaryMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 100 })

  // useGSAP runs pre-paint (via useLayoutEffect internally) and handles full
  // cleanup via gsap.context().revert() on unmount — including matchMedia and
  // ScrollTriggers. This is the official pattern for Next.js App Router and
  // prevents ScrollTrigger leaks across route changes.
  useGSAP(
    () => {
      // Split the title ONCE, outside matchMedia. Both breakpoints reference
      // the same split; matchMedia only branches the tween shape.
      const splitTitle = titleRef.current
        ? new SplitType(titleRef.current, { types: "chars,words" })
        : null

      // --------------------------------------------------------------
      // ENTRY — matchMedia-driven. Single callback, branches on isMobile.
      // --------------------------------------------------------------
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduced } = context.conditions as {
            isDesktop: boolean
            isMobile: boolean
            reduced: boolean
          }

          // Suppress CSS transition-transform on the CTA anchors during the
          // entry. They have `transition-transform duration-300` for the
          // useMagnetic smoothing, which fights GSAP's per-frame transform
          // writes. Restored in the CTA tween's onComplete.
          const buttons = ctasRef.current
            ? (Array.from(
                ctasRef.current.querySelectorAll<HTMLAnchorElement>("a"),
              ) as HTMLAnchorElement[])
            : []
          buttons.forEach((b) => {
            b.style.transition = "none"
          })

          if (reduced) {
            // Snap everything to the final state.
            if (imageWrapperRef.current) {
              gsap.set(imageWrapperRef.current, { opacity: 1, clipPath: "inset(0 0% 0 0%)" })
            }
            if (imageRef.current) gsap.set(imageRef.current, { scale: 1 })
            if (splitTitle?.chars) {
              gsap.set(splitTitle.chars, { opacity: 1, yPercent: 0, rotateX: 0 })
              if (titleRef.current) gsap.set(titleRef.current, { opacity: 1 })
            } else if (titleRef.current) {
              gsap.set(titleRef.current, { opacity: 1, y: 0 })
            }
            if (dividerRef.current) gsap.set(dividerRef.current, { opacity: 1, scaleX: 1 })
            if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1, y: 0 })
            if (buttons.length > 0) {
              gsap.set(buttons, { opacity: 1, y: 0, scale: 1 })
            }
            if (scrollIndicatorRef.current) {
              gsap.set(scrollIndicatorRef.current, { opacity: 1, y: 0 })
            }
            buttons.forEach((b) => {
              b.style.transition = ""
            })
            return
          }

          // Mobile tuning: duration -20%, stagger -30%, gentler eases.
          const factor = isMobile ? 0.8 : 1
          const staggerFactor = isMobile ? 0.7 : 1
          const baseEase = isMobile ? "power2.out" : "expo.out"
          const ctaEase = isMobile ? "back.out(1.2)" : "back.out(1.6)"

          // Desktop gets `perspective` for the 3D char rotation. Mobile
          // skips it — no rotateX means no need for the 3D layer context.
          if (!isMobile && titleRef.current) {
            gsap.set(titleRef.current, { perspective: 800 })
          }

          const tl = gsap.timeline({
            defaults: { ease: baseEase },
          })

          // -- 1. Background image reveal ------------------------------
          // Composited-only entry: opacity + transform on the wrapper.
          // No clip-path (forces repaint), no scale on the <video> element
          // (forces re-rasterizing each decoded frame). The video plays
          // unscaled while the wrapper fades in, keeping the GPU happy.
          if (imageWrapperRef.current) {
            tl.fromTo(
              imageWrapperRef.current,
              {
                opacity: 0,
                scale: isMobile ? 1.08 : 1.04,
                willChange: "transform, opacity",
              },
              {
                opacity: 1,
                scale: 1,
                duration: isMobile ? 1.4 : 1.6,
                ease: "power3.out",
                onComplete: () => {
                  if (imageWrapperRef.current) {
                    // Keep willChange — parallax scroll below needs the layer.
                    gsap.set(imageWrapperRef.current, { clearProps: "transform" })
                  }
                },
              },
              0,
            )
          }

          // -- 2. Title characters cascade ------------------------------
          if (splitTitle?.chars && splitTitle.chars.length > 0) {
            const charFrom: gsap.TweenVars = {
              yPercent: 120,
              opacity: 0,
              willChange: "transform, opacity",
            }
            const charTo: gsap.TweenVars = {
              yPercent: 0,
              opacity: 1,
              duration: 1.2 * factor,
              ease: "expo.out",
              stagger: 0.025 * staggerFactor,
              onComplete: () => {
                if (splitTitle?.chars) {
                  gsap.set(splitTitle.chars, { clearProps: "willChange,transform" })
                }
              },
            }
            // Desktop keeps the full 3D rotation; mobile skips it entirely
            // (no perspective layer context, no software rendering tax).
            if (!isMobile) {
              charFrom.rotateX = -60
              charTo.rotateX = 0
            }
            tl.fromTo(splitTitle.chars, charFrom, charTo, 0.6)
            // Chars are now at opacity:0 (immediateRender). Reveal the h1
            // container so the chars become visible when they animate in.
            if (titleRef.current) gsap.set(titleRef.current, { opacity: 1 })
          } else if (titleRef.current) {
            tl.fromTo(
              titleRef.current,
              { opacity: 0, y: 40, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                duration: 0.8 * factor,
                onComplete: () => {
                  if (titleRef.current) {
                    gsap.set(titleRef.current, { clearProps: "willChange,transform" })
                  }
                },
              },
              0.6,
            )
          }

          // -- 2.5. Divider line: scaleX reveal from center ------------
          if (dividerRef.current) {
            tl.fromTo(
              dividerRef.current,
              { opacity: 0, scaleX: 0, transformOrigin: "center", willChange: "transform, opacity" },
              {
                opacity: 1,
                scaleX: 1,
                duration: 0.8 * factor,
                ease: "power3.out",
                onComplete: () => {
                  if (dividerRef.current) {
                    gsap.set(dividerRef.current, { clearProps: "willChange,transform" })
                  }
                },
              },
              1.2,
            )
          }

          // -- 3. Subtitle: opacity + y only (no filter blur) -----------
          if (subtitleRef.current) {
            tl.fromTo(
              subtitleRef.current,
              { opacity: 0, y: 30, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                duration: 1.0 * factor,
                ease: "power3.out",
                onComplete: () => {
                  if (subtitleRef.current) {
                    gsap.set(subtitleRef.current, { clearProps: "willChange,transform" })
                  }
                },
              },
              1.4,
            )
          }

          // -- 4. CTAs: scale + fade stagger ----------------------------
          if (buttons.length > 0) {
            tl.fromTo(
              buttons,
              { opacity: 0, scale: 0.85, y: 20, willChange: "transform, opacity" },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7 * factor,
                ease: ctaEase,
                stagger: 0.12 * staggerFactor,
                onComplete: () => {
                  buttons.forEach((b) => {
                    gsap.set(b, { clearProps: "willChange,transform" })
                    b.style.transition = ""
                  })
                },
              },
              1.7,
            )
          }

          // -- 5. Scroll indicator --------------------------------------
          if (scrollIndicatorRef.current) {
            tl.fromTo(
              scrollIndicatorRef.current,
              { opacity: 0, y: -10, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                duration: 0.8 * factor,
                ease: "power2.out",
                onComplete: () => {
                  if (scrollIndicatorRef.current) {
                    // Leave willChange set — scroll-linked fade-out below needs it.
                    gsap.set(scrollIndicatorRef.current, { clearProps: "transform" })
                  }
                },
              },
              2.2,
            )
          }
        },
      )

      // --------------------------------------------------------------
      // SCROLL-LINKED — parallax + fade-out. Skipped on touch devices
      // so GSAP ticker stays idle during scroll after the entry completes.
      // Touch devices get a lightweight passive scroll listener below.
      // --------------------------------------------------------------
      if (!isTouchDevice() && sectionRef.current) {
        const scrub = getScrubValue()

        if (imageWrapperRef.current) {
          gsap.set(imageWrapperRef.current, { willChange: "transform" })
          gsap.to(imageWrapperRef.current, {
            yPercent: 25,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub,
            },
          })
        }

        if (contentRef.current) {
          gsap.set(contentRef.current, { willChange: "transform, opacity" })
          gsap.to(contentRef.current, {
            yPercent: -30,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "70% top",
              scrub,
            },
          })
        }

        if (scrollIndicatorRef.current) {
          gsap.set(scrollIndicatorRef.current, { willChange: "transform, opacity" })
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "20% top",
              scrub,
            },
          })
        }
      }
    },
    { scope: sectionRef },
  )

  useScrollReveal(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Video */}
      <div ref={imageWrapperRef} className="absolute inset-0 opacity-0">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video
          ref={imageRef}
          src="/video/hero-fachada.mp4"
          poster="/video/hero-fachada-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-20 container mx-auto px-4 text-center">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-balance text-white px-4 opacity-0"
        >
          Tu próximo capítulo
          <br />
          <span className="text-white break-words">empieza en San Fernando.</span>
        </h1>
        <div
          ref={dividerRef}
          className="hidden sm:block h-px w-24 bg-white/40 mx-auto mb-8 opacity-0"
          aria-hidden="true"
        />
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-12 text-pretty opacity-0"
        >
          Diseño, ubicación y calidad de vida en un solo lugar.
        </p>
        <div
          ref={ctasRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            ref={primaryMagnetic.ref}
            onMouseEnter={primaryMagnetic.handleMouseEnter}
            onMouseMove={primaryMagnetic.handleMouseMove}
            onMouseLeave={primaryMagnetic.handleMouseLeave}
            href="#experiencia"
            className="group px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 active:scale-[0.97] transition-transform duration-300 ease-out animate-glow-pulse opacity-0"
          >
            {brand.cta.primary}
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            ref={secondaryMagnetic.ref}
            onMouseEnter={secondaryMagnetic.handleMouseEnter}
            onMouseMove={secondaryMagnetic.handleMouseMove}
            onMouseLeave={secondaryMagnetic.handleMouseLeave}
            href="#contacto"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black active:scale-[0.97] transition-transform duration-300 ease-out opacity-0"
          >
            {brand.cta.secondary}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-0"
      >
        <ChevronDown className="text-white" size={32} />
      </div>
    </section>
  )
}
