"use client"

import { useEffect, useRef, useState } from "react"
import SplitType from "split-type"
import { brand } from "@/config/brand"
import { GooeyText } from "@/components/ui/gooey-text"
import { FloatingPaths } from "@/components/ui/background-paths"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap-utils"

export function ConceptSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const gooeyWrapperRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const [counts, setCounts] = useState<number[]>(Array(brand.stats.length).fill(0))

  useEffect(() => {
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      // Split the static top line "CONVERTIMOS CONCEPTOS EN"
      const topLine = h2Ref.current?.querySelector<HTMLElement>("[data-concept-top]")
      const splitTop =
        topLine && !reduced
          ? new SplitType(topLine, { types: "words,chars" })
          : null

      // Split the right column h2 "De la idea a la experiencia"
      const rightH2 = rightContentRef.current?.querySelector<HTMLElement>("h2")
      const splitRight =
        rightH2 && !reduced
          ? new SplitType(rightH2, { types: "words" })
          : null

      // --------------------------------------------------------------
      // CARD TIMELINE — triggered when the dark card enters the viewport
      // --------------------------------------------------------------
      if (cardRef.current) {
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 75%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // 1. Card reveal with clip-path unroll + subtle scale
        cardTl.fromTo(
          cardRef.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 0.96,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 1.3,
            ease: "power3.out",
          },
          0,
        )

        // 2. Boxshadow intensifies after card is in place (via CSS var trick)
        if (!reduced) {
          cardTl.fromTo(
            cardRef.current,
            { boxShadow: "0 0 0px rgba(220, 200, 170, 0), 0 0 0px rgba(220, 200, 170, 0)" },
            {
              boxShadow:
                "0 0 60px rgba(220, 200, 170, 0.45), 0 0 140px rgba(220, 200, 170, 0.22)",
              duration: 1.0,
              ease: "power2.out",
            },
            0.4,
          )
        }

        // 3. Top line words cascade from below
        if (splitTop?.chars && splitTop.chars.length > 0) {
          cardTl.fromTo(
            splitTop.chars,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.018,
            },
            0.5,
          )
        }

        // 4. GooeyText wrapper fades in with blur resolve
        if (gooeyWrapperRef.current) {
          cardTl.fromTo(
            gooeyWrapperRef.current,
            { opacity: 0, filter: "blur(14px)", y: 20 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: reduced ? 0 : 1.0,
              ease: "power3.out",
            },
            reduced ? 0 : 1.0,
          )
        }

        // 5. Subtitle fades in
        if (subtitleRef.current) {
          cardTl.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 0.8,
              ease: "power3.out",
            },
            reduced ? 0 : 1.3,
          )
        }
      }

      // --------------------------------------------------------------
      // LEFT IMAGE — clip-path reveal + parallax on scroll
      // --------------------------------------------------------------
      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          {
            clipPath: "inset(0% 100% 0% 0%)",
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: reduced ? 0 : 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: "top 80%",
              once: true,
            },
          },
        )

        // Subtle scale on the image itself as a secondary reveal
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { scale: 1.15 },
            {
              scale: 1,
              duration: reduced ? 0 : 1.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: imageWrapperRef.current,
                start: "top 80%",
                once: true,
              },
            },
          )

          // Parallax: image drifts slower than scroll while section is in view
          if (!reduced) {
            gsap.to(imageRef.current, {
              yPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: imageWrapperRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            })
          }
        }
      }

      // --------------------------------------------------------------
      // RIGHT CONTENT — eyebrow, h2 word reveal, paragraphs, stats
      // --------------------------------------------------------------
      if (rightContentRef.current) {
        const rightTl = gsap.timeline({
          scrollTrigger: {
            trigger: rightContentRef.current,
            start: "top 75%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // Eyebrow "El Concepto"
        const eyebrow = rightContentRef.current.querySelector<HTMLElement>("span.text-black")
        if (eyebrow) {
          rightTl.fromTo(
            eyebrow,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.6 },
            0,
          )
        }

        // Right h2 words stagger
        if (splitRight?.words && splitRight.words.length > 0) {
          rightTl.fromTo(
            splitRight.words,
            { opacity: 0, y: 40, rotateX: -40 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              stagger: 0.06,
            },
            0.15,
          )
        }

        // Paragraphs fade + slide
        const paragraphs = rightContentRef.current.querySelectorAll("p")
        if (paragraphs.length > 0) {
          rightTl.fromTo(
            paragraphs,
            { opacity: 0, y: 25, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              stagger: 0.12,
              ease: "power3.out",
            },
            reduced ? 0 : 0.6,
          )
        }

        // Stats cards fade up + scale
        if (statsRef.current) {
          const cards = statsRef.current.querySelectorAll<HTMLElement>("[data-stat]")
          if (cards.length > 0) {
            rightTl.fromTo(
              cards,
              { opacity: 0, y: 30, scale: 0.85 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: reduced ? 0 : 0.7,
                stagger: 0.1,
                ease: "back.out(1.6)",
              },
              reduced ? 0 : 1.1,
            )
          }
        }
      }

      // --------------------------------------------------------------
      // STATS COUNT-UP — GSAP-driven, triggered once stats are visible
      // --------------------------------------------------------------
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            brand.stats.forEach((stat, i) => {
              const proxy = { val: 0 }
              gsap.to(proxy, {
                val: stat.value,
                duration: reduced ? 0 : 2.0,
                ease: "power2.out",
                onUpdate: () => {
                  setCounts((prev) => {
                    const next = [...prev]
                    next[i] = Math.floor(proxy.val)
                    return next
                  })
                },
                onComplete: () => {
                  setCounts((prev) => {
                    const next = [...prev]
                    next[i] = stat.value
                    return next
                  })
                },
              })
            })
          },
        })
      }
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section id="concepto" ref={sectionRef} className="relative py-16 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
        <FloatingPaths position={1} svgClassName="text-slate-900" />
        <FloatingPaths position={-1} svgClassName="text-slate-900" />
      </div>
      <div className="relative container mx-auto px-4 lg:px-8">
        <div
          ref={cardRef}
          className="bg-[#1a1a1a] text-white rounded-2xl p-10 lg:p-12 mb-16 will-change-transform"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              ref={h2Ref}
              className="font-bold mb-6 text-balance leading-[1.05]"
              style={{ perspective: "800px" }}
            >
              <span data-concept-top className="block text-4xl md:text-5xl lg:text-6xl">
                CONVERTIMOS CONCEPTOS EN
              </span>
              <span
                ref={gooeyWrapperRef}
                className="block mt-2"
                style={{
                  filter:
                    "drop-shadow(0 0 30px rgba(255, 255, 255, 0.45)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.2))",
                }}
              >
                <GooeyText
                  texts={["EXPERIENCIAS", "REALIDADES", "HOGARES"]}
                  morphTime={0.6}
                  cooldownTime={0.4}
                  textClassName="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]"
                />
              </span>
            </h2>
            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-gray-300 leading-relaxed text-pretty"
            >
              Somos un estudio de Arquitectura y visualización con sede en Buenos Aires, Argentina.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Evolution Visualization */}
          <div className="relative">
            <div ref={imageWrapperRef} className="relative aspect-square will-change-transform">
              <img
                ref={imageRef}
                src="/images/design-mode/cbq_gbd_ath_View_10.jpg"
                alt="Concept Evolution"
                className="w-full h-full object-cover rounded-lg will-change-transform"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div ref={rightContentRef} style={{ perspective: "1000px" }}>
            <span className="text-black text-sm font-semibold tracking-wider uppercase">El Concepto</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black">
              De la idea a la <span className="text-black">experiencia</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-pretty">
              Cada proyecto comienza con una visión. Transformamos bocetos y conceptos arquitectónicos en experiencias
              inmersivas que permiten vivir los espacios antes de su construcción.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed text-pretty">
              Nuestra tecnología de visualización 3D y recorridos virtuales 360° revoluciona la forma en que
              desarrolladores y clientes experimentan la arquitectura moderna.
            </p>
            <div ref={statsRef} className="grid grid-cols-3 gap-6">
              {brand.stats.map((stat, i) => (
                <div key={stat.label} data-stat className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    {counts[i]}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
