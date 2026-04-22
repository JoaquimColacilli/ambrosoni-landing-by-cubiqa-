"use client"

import { useState, useEffect, useRef } from "react"
import { Maximize2 } from "lucide-react"
import SplitType from "split-type"
import { brand } from "@/config/brand"
import { NetworkNodes } from "@/components/ui/network-nodes"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

export function ImmersiveSection() {
  const [selectedTour, setSelectedTour] = useState(brand.tours360[0]?.id ?? "")
  const [fullscreenTourId, setFullscreenTourId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tourWrapperRef = useRef<HTMLDivElement>(null)
  const tourTitleRef = useRef<HTMLDivElement>(null)
  const tourFrameRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLDivElement | null>(null)
  const helpTextRef = useRef<HTMLDivElement>(null)
  const techCardRef = useRef<HTMLDivElement>(null)

  // Swap the iframeRef in sync with tourFrameRef — they point to the same div
  const setFrameRefs = (el: HTMLDivElement | null) => {
    tourFrameRef.current = el
    iframeRef.current = el
  }

  useGSAP(
    () => {
      if (isTouchDevice()) return
      const reduced = prefersReducedMotion()

      // ----------------------------------------------------------
      // HEADER — SplitText por líneas con reveal + blur
      // ----------------------------------------------------------
      if (headerRef.current) {
        const eyebrow = headerRef.current.querySelector<HTMLElement>("[data-eyebrow]")
        const h2 = headerRef.current.querySelector<HTMLHeadingElement>("h2")
        const paragraph = headerRef.current.querySelector<HTMLParagraphElement>("p")

        const splitH2 =
          h2 && !reduced
            ? new SplitType(h2, { types: "lines,words", lineClass: "split-line" })
            : null

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 78%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        if (eyebrow) {
          headerTl.fromTo(
            eyebrow,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.6 },
            0,
          )
        }

        // Por línea: cada línea entra con y + blur resolviendo
        if (splitH2?.lines && splitH2.lines.length > 0) {
          headerTl.fromTo(
            splitH2.lines,
            { opacity: 0, y: 60, filter: "blur(10px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.2,
              stagger: 0.15,
              ease: "power3.out",
            },
            0.15,
          )
        }

        if (paragraph) {
          headerTl.fromTo(
            paragraph,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              ease: "power3.out",
            },
            reduced ? 0 : 0.9,
          )
        }
      }

      // ----------------------------------------------------------
      // TABS — stagger desde abajo
      // ----------------------------------------------------------
      if (tabsRef.current) {
        const tabButtons = tabsRef.current.querySelectorAll<HTMLButtonElement>("button")
        if (tabButtons.length > 0) {
          gsap.fromTo(
            tabButtons,
            {
              opacity: 0,
              y: 30,
              scale: 0.88,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: reduced ? 0 : 0.7,
              ease: "back.out(1.6)",
              stagger: 0.08,
              scrollTrigger: {
                trigger: tabsRef.current,
                start: "top 82%",
                once: true,
              },
            },
          )
        }
      }

      // ----------------------------------------------------------
      // TOUR WRAPPER — título del tour + iframe clip-path reveal
      // ----------------------------------------------------------
      if (tourWrapperRef.current) {
        const wrapperTl = gsap.timeline({
          scrollTrigger: {
            trigger: tourWrapperRef.current,
            start: "top 75%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // Título + descripción del tour
        if (tourTitleRef.current) {
          wrapperTl.fromTo(
            tourTitleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.8 },
            0,
          )
        }

        // Iframe container: reveal con clip-path desde abajo hacia arriba
        if (tourFrameRef.current) {
          wrapperTl.fromTo(
            tourFrameRef.current,
            {
              clipPath: "inset(100% 0% 0% 0%)",
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: reduced ? 0 : 1.3,
              ease: "power3.out",
            },
            reduced ? 0 : 0.25,
          )
        }
      }

      // ----------------------------------------------------------
      // HELP TEXT — fade simple
      // ----------------------------------------------------------
      if (helpTextRef.current) {
        gsap.fromTo(
          helpTextRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: helpTextRef.current,
              start: "top 85%",
              once: true,
            },
          },
        )
      }

      // ----------------------------------------------------------
      // TECH CARD — dark bloque con clip-path + SplitText h3
      // ----------------------------------------------------------
      if (techCardRef.current) {
        const h3 = techCardRef.current.querySelector<HTMLHeadingElement>("h3")
        const paragraph = techCardRef.current.querySelector<HTMLParagraphElement>("p")

        const splitH3 =
          h3 && !reduced ? new SplitType(h3, { types: "words" }) : null

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: techCardRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        // Card reveal con clip-path desde arriba
        cardTl.fromTo(
          techCardRef.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 0.96,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 1.2,
            ease: "power3.out",
          },
          0,
        )

        // H3 words cascade
        if (splitH3?.words && splitH3.words.length > 0) {
          cardTl.fromTo(
            splitH3.words,
            { opacity: 0, y: 40, rotateX: -40 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              stagger: 0.06,
            },
            reduced ? 0 : 0.5,
          )
        }

        if (paragraph) {
          cardTl.fromTo(
            paragraph,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              ease: "power3.out",
            },
            reduced ? 0 : 0.9,
          )
        }
      }
    },
    { scope: sectionRef },
  )

  // Touch-only CSS reveal (header fade-up + tabs stagger + tour scale-in +
  // tech card slide-in-right).
  useScrollReveal(sectionRef)

  const toggleFullscreen = () => {
    const container = iframeRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
      setFullscreenTourId(selectedTour)
    } else {
      document.exitFullscreen()
      setFullscreenTourId(null)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenTourId(null)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const currentTour = brand.tours360.find((tour) => tour.id === selectedTour) || brand.tours360[0]

  return (
    <section id="experiencia" ref={sectionRef} className="relative py-16 bg-gray-50 overflow-hidden">
      <NetworkNodes />
      <div className="relative container mx-auto px-4 lg:px-8">
        <div ref={headerRef} className="text-center mb-16" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            data-reveal="fade-up"
            className="text-black text-sm font-semibold tracking-wider uppercase"
          >
            Experiencia Inmersiva
          </span>
          <h2
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold italic mt-4 mb-6 text-balance text-black"
          >
            Caminá por tu futuro hogar
            <br />
            <span className="text-black">antes de que exista</span>
          </h2>
          <p
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty"
          >
            Con nuestro recorrido 360° podés entrar a cada ambiente, ver cómo entra la luz, imaginar dónde va el sillón
            y sentir el espacio como si ya fuera tuyo. Todo antes de firmar.
          </p>
        </div>

        <div ref={tabsRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {brand.tours360.map((tour, i) => (
            <button
              key={tour.id}
              data-reveal="fade-up"
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              onClick={() => setSelectedTour(tour.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedTour === tour.id
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300 hover:border-black"
              }`}
            >
              {tour.title}
            </button>
          ))}
        </div>

        <div ref={tourWrapperRef}>
          <div ref={tourTitleRef} data-reveal="fade-up" className="mb-6 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-2">{currentTour.title}</h3>
            <p className="text-gray-600 text-lg">{currentTour.description}</p>
          </div>

          <div
            ref={setFrameRefs}
            data-reveal="scale-in"
            style={{
              ["--reveal-delay" as string]: "120ms",
              height: fullscreenTourId === selectedTour ? "100vh" : "640px",
            }}
            className="relative rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 will-change-transform"
          >
            {currentTour.url ? (
              <>
                <iframe
                  key={selectedTour}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="xr-spatial-tracking; gyroscope; accelerometer"
                  allowFullScreen
                  scrolling="no"
                  src={currentTour.url}
                  className="w-full h-full"
                  title={`Recorrido Virtual 360° - ${currentTour.title}`}
                />

                {fullscreenTourId !== selectedTour && (
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-black/80 transition-all duration-300 z-10"
                    aria-label="Pantalla completa"
                  >
                    <Maximize2 size={20} />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏗️</div>
                  <p className="text-2xl font-semibold text-gray-800 mb-2">Próximamente</p>
                  <p className="text-gray-600">Acá va el recorrido 360° de {currentTour.title}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div ref={helpTextRef} data-reveal="fade-up" className="text-center my-12">
          <p className="text-gray-600 text-sm">
            Navegá entre los diferentes espacios usando los controles del visor. Hacé clic y arrastrá para explorar en
            360°
          </p>
        </div>

        <div
          ref={techCardRef}
          data-reveal="slide-in-right"
          className="mt-16 bg-[#1a1a1a] text-white rounded-2xl p-12 will-change-transform"
          style={{ perspective: "1000px" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">El espacio que tu familia necesita.</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Cada unidad fue pensada para que la distribución tenga sentido: dormitorios con luz, living que invita a
              quedarse, cocina integrada y balcón para tomar el aire. Todo con cochera incluida.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Elegís la tipología que se adapta a tu momento de vida.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
