"use client"

import { useState, useEffect, useRef } from "react"
import { Maximize2 } from "lucide-react"
import { brand } from "@/config/brand"

export function ImmersiveSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTour, setSelectedTour] = useState(brand.tours360[0]?.id ?? "")
  const [fullscreenTourId, setFullscreenTourId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const iframeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

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
    <section id="experiencia" ref={sectionRef} className="relative py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-black text-sm font-semibold tracking-wider uppercase">Experiencia Inmersiva</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black">
            Caminá por tu futuro hogar
            <br />
            <span className="text-black">antes de que exista</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty">
            Explorá cada rincón con nuestra tecnología de recorrido virtual 360°
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {brand.tours360.map((tour) => (
            <button
              key={tour.id}
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

        <div
          className={`transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-6 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-2">{currentTour.title}</h3>
            <p className="text-gray-600 text-lg">{currentTour.description}</p>
          </div>

          <div
            ref={iframeRef}
            className="relative rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200"
            style={{ height: fullscreenTourId === selectedTour ? "100vh" : "640px" }}
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

        <div
          className={`text-center my-12 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-gray-600 text-sm">
            Navegá entre los diferentes espacios usando los controles del visor. Hacé clic y arrastrá para explorar en
            360°
          </p>
        </div>

        <div
          className={`mt-16 bg-[#1a1a1a] text-white rounded-2xl p-12 transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Tecnología de Visualización Avanzada</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Utilizamos las últimas herramientas de renderizado y realidad virtual para crear experiencias inmersivas
              que te permiten explorar cada detalle de tu futuro hogar antes de que se construya. Nuestros recorridos
              360° te dan la libertad de moverte por los espacios como si ya estuvieras ahí.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
