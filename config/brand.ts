// ============================================================================
// AMBROSONI — AR Building
// Archivo central de branding. Fuente unica de verdad para todo dato de marca,
// contacto, ubicacion, contenido configurable del proyecto.
// Cada cliente de Cubiqa tiene su propio brand.ts — los componentes consumen
// estos datos y rendean. No hardcodear nada de cliente en componentes.
// TODO: paleta definitiva AR Building pendiente — usando NOIR base como fallback
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Typology = {
  id: string
  name: string
  totalArea: number
  coveredArea: number
  bedrooms: number
  bathrooms: number
  planImage: string
  description?: string
}

export type Phone = {
  name: string
  number: string
  whatsappNumber: string // formato wa.me sin + ni espacios
}

export type Stat = {
  value: number
  suffix?: string // "+", "K", "%", etc.
  label: string
}

export type UnitStatus = "available" | "reserved" | "sold"

export type Unit = {
  floor: string
  unit: string
  rooms: number
  coveredSqm: number // Superficie cubierta
  uncoveredSqm: number // Superficie descubierta (terraza/balcón)
  status: UnitStatus
  price: string
}

export type Tour360 = {
  id: string
  title: string
  description: string
  url: string | null // null = "Proximamente"
}

export type GalleryCategory = {
  id: string
  name: string
  iconName: string // nombre del icono de lucide-react
  subtitle: string
  description: string
  images: string[]
}

export type NearbyPlace = {
  name: string
  distance: string
  time: string
  iconName: string // "MapPin" | "Train" | "Car" | etc.
}

export type OfficeHours = {
  weekdays: string
  saturday: string
  sunday: string
}

export type SeoFaqEntry = {
  question: string
  answer: string
}

export type SeoOfferTipo = {
  name: string
  description: string
  rooms: number
  coveredSqm: number
  uncoveredSqm: number
}

export type SeoConfig = {
  // URL canónica de producción (se sobreescribe via NEXT_PUBLIC_SITE_URL)
  siteUrl: string
  // Geo del edificio (verificar con cliente)
  geo: { latitude: number; longitude: number }
  postalCode: string
  // Color del theme (PWA / Safari address bar)
  themeColor: string
  // Codigo de Google Search Console (vacio = sin meta tag)
  googleVerification: string
  // Imagen OG (1200x630 ideal). TODO: render dedicado.
  ogImage: string
  // Schema.org: tipologia summary
  schema: {
    siteName: string
    title: string
    description: string
    ogTitle: string
    ogDescription: string
    twitterDescription: string
    locale: string // es_AR
    htmlLang: string // es-AR
    alternateName: string
    totalUnits: number
    totalFloors: number
    unitsPerFloor: number
    petsAllowed: boolean
    priceRange: string // "$" | "$$" | "$$$"
    amenities: string[]
    additionalProperties: { name: string; value: string }[]
    offers: SeoOfferTipo[]
  }
  faq: SeoFaqEntry[]
}

// ---------------------------------------------------------------------------
// Brand data
// ---------------------------------------------------------------------------

export const brand = {
  // --- Empresa y proyecto ---
  company: "AR Building",
  project: "AMBROSONI",
  template: "NOIR",

  // --- Logo ---
  logo: "/AMBROSONI/LOGO_sin_fondo.png",
  logoAlt: "AR Building — AMBROSONI",

  // --- Contacto ---
  email: "info@arbuilding.com.ar",
  phones: [
    {
      name: "Maiqui",
      number: "+54 11 3862 8300",
      whatsappNumber: "5491138628300",
    },
    {
      name: "Leo",
      number: "+54 11 4673 8609",
      whatsappNumber: "5491146738609",
    },
  ] satisfies Phone[],

  // WhatsApp principal (Maiqui)
  whatsapp: {
    number: "5491138628300",
    // TODO: copy mensaje WhatsApp pendiente de cliente
    message: "Hola! Me interesa obtener mas informacion sobre AMBROSONI.",
  },

  // --- Redes sociales ---
  instagram: {
    handle: "@arbuilding.ar",
    url: "https://www.instagram.com/arbuilding.ar",
  },

  // --- Ubicacion ---
  location: {
    address: "Ambrosoni 1321",
    area: "Victoria — San Fernando",
    city: "Buenos Aires",
    country: "Argentina",
    full: "Ambrosoni 1321, Victoria — San Fernando, Buenos Aires, Argentina",
  },
  // TODO: verificar coordenadas exactas para el embed de Google Maps
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.0!2d-58.445!3d-34.453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAmbrosoni+1321%2C+Victoria%2C+San+Fernando!5e0!3m2!1ses!2sar",

  // --- Metadata SEO ---
  metadata: {
    // TODO: copy metadata pendiente de cliente
    title: "AMBROSONI | AR Building — Desarrollo inmobiliario en Victoria",
    description:
      "AMBROSONI: nuevo desarrollo de AR Building en Ambrosoni 1321, Victoria — San Fernando. Departamentos diseñados para vivir una experiencia unica.",
    // TODO: OG tags pendientes de cliente
    ogTitle: "AMBROSONI | AR Building",
    ogDescription:
      "Nuevo desarrollo inmobiliario en Victoria, San Fernando. Departamentos con diseño contemporaneo y amenities premium.",
  },

  // --- SEO ---
  // Toda la data extra para metadata avanzada, JSON-LD, llms.txt, sitemap.
  // Pattern espejo del setup de Edificio MERCED.
  seo: {
    siteUrl: "https://edificioambrosoni.com",
    // TODO: verificar coordenadas exactas del lote en Ambrosoni 1321 (estimadas del mapsEmbedUrl)
    geo: { latitude: -34.453, longitude: -58.445 },
    // TODO: confirmar codigo postal Victoria — San Fernando (B1644 es el estandar de la zona)
    postalCode: "B1644",
    themeColor: "#0a0a0a",
    // TODO: cargar codigo Google Search Console cuando este verificado
    googleVerification: "",
    // TODO: render dedicado 1200x630 para OG (placeholder: usa la vista del hero)
    ogImage: "/images/cbq_ab_am_view_01.jpg",
    schema: {
      siteName: "AMBROSONI — AR Building",
      title: "Departamentos en Victoria, San Fernando | AMBROSONI",
      description:
        "AMBROSONI: nuevo edificio en Ambrosoni 1321, Victoria — San Fernando, Buenos Aires. Departamentos de 1 y 2 ambientes con diseno contemporaneo, ubicacion privilegiada y amenities premium.",
      ogTitle: "Departamentos en Victoria, San Fernando | AMBROSONI",
      ogDescription:
        "AMBROSONI: nuevo edificio en Ambrosoni 1321, Victoria — San Fernando. Departamentos de 1 y 2 ambientes, diseno contemporaneo y ubicacion privilegiada.",
      twitterDescription:
        "El nuevo edificio en Victoria, San Fernando. Departamentos de 1 y 2 ambientes. Consulta disponibilidad!",
      locale: "es_AR",
      htmlLang: "es-AR",
      alternateName: "AMBROSONI Edificio",
      totalUnits: 15, // 3 pisos x 5 unidades por piso (segun comentario de typologies)
      totalFloors: 3,
      unitsPerFloor: 5,
      petsAllowed: true,
      priceRange: "$$",
      // TODO: confirmar amenities reales del edificio con AR Building
      amenities: [
        "Ascensor",
        "Iluminacion natural",
        "Terrazas privadas",
      ],
      additionalProperties: [
        { name: "Distancia a Plaza Dorrego", value: "En la puerta del edificio" },
        { name: "Distancia a Estacion Victoria (Tren Mitre)", value: "5 min" },
        { name: "Total de pisos", value: "3" },
        { name: "Total de unidades", value: "15" },
      ],
      // Espejo de typologies — formato Schema.org Offer/Apartment
      offers: [
        {
          name: "Departamento 2 Ambientes — Tipologia A/B",
          description:
            "Departamento de 2 ambientes de 65m2 cubiertos + 16m2 descubiertos en AMBROSONI, Victoria — San Fernando.",
          rooms: 2,
          coveredSqm: 65,
          uncoveredSqm: 16,
        },
        {
          name: "Departamento 1 Ambiente — Tipologia D/E",
          description:
            "Departamento de 1 ambiente de 53m2 cubiertos + 12m2 descubiertos en AMBROSONI, Victoria — San Fernando.",
          rooms: 1,
          coveredSqm: 53,
          uncoveredSqm: 12,
        },
        {
          name: "Departamento 1 Ambiente — Tipologia C",
          description:
            "Departamento de 1 ambiente de 53m2 cubiertos + 7.5m2 descubiertos en AMBROSONI, Victoria — San Fernando.",
          rooms: 1,
          coveredSqm: 53,
          uncoveredSqm: 7.5,
        },
      ],
    },
    // FAQs alineadas al esquema FAQPage (JSON-LD) y al texto de llms.txt.
    // Foco: ubicacion, tipologias, inversion, contacto, entorno.
    faq: [
      {
        question: "Donde esta ubicado AMBROSONI?",
        answer:
          "AMBROSONI esta ubicado en Ambrosoni 1321, Victoria — San Fernando, Buenos Aires, Argentina. Frente a Plaza Dorrego y a 5 minutos de la Estacion Victoria del Tren Mitre.",
      },
      {
        question: "Que tipos de departamentos tiene AMBROSONI?",
        answer:
          "AMBROSONI ofrece departamentos de 1 y 2 ambientes en tres tipologias (A/B, C, D/E). El edificio cuenta con 15 unidades distribuidas en 3 pisos de 5 unidades por piso.",
      },
      {
        question: "Se puede invertir comprando un departamento en AMBROSONI?",
        answer:
          "Si. AMBROSONI esta ubicado en Victoria, San Fernando — una zona consolidada con alta demanda de alquiler por su cercania al Tren Mitre, accesos a CABA y servicios. La proximidad a Plaza Dorrego y a transporte publico lo convierte en una opcion solida para inversion inmobiliaria.",
      },
      {
        question: "Como puedo consultar sobre unidades disponibles en AMBROSONI?",
        answer:
          "Podes consultar disponibilidad completando el formulario en la seccion de contacto del sitio, escribiendo a info@arbuilding.com.ar o por WhatsApp al +54 11 3862 8300 (Maiqui) o +54 11 4673 8609 (Leo). El horario de atencion es de lunes a viernes de 9:00 a 18:00 y sabados de 10:00 a 14:00.",
      },
      {
        question: "Que tiene cerca AMBROSONI en Victoria, San Fernando?",
        answer:
          "AMBROSONI esta frente a Plaza Dorrego, a 5 minutos de la Estacion Victoria del Tren Mitre, a 2 minutos de Av. Presidente Peron (acceso a autopista y centro), con paradas de los colectivos 60, 203, 365 y 371 en la puerta, gastronomia y comercios a la redonda y un centro medico privado a 2 minutos sobre Ing. White.",
      },
    ],
  } satisfies SeoConfig,

  // --- Navegacion ---
  navItems: [
    { label: "Concepto", href: "#concepto" },
    { label: "Experiencia 360°", href: "#experiencia" },
    { label: "Galería", href: "#galeria" },
    { label: "Unidades", href: "#unidades" },
    { label: "Tipologías", href: "#tipologias" },
    { label: "Ubicación", href: "#ubicacion" },
    { label: "Contacto", href: "#contacto" },
  ],

  // --- CTA texts ---
  cta: {
    // TODO: copy CTAs pendiente de cliente
    primary: "Explorar Proyecto",
    secondary: "Contactar",
    nav: "Agendar Visita",
    whatsapp: "Contactanos por WhatsApp",
  },

  // --- Stats (concept section — numeros del proyecto) ---
  stats: [
    {
      value: 100, // TODO: dato real pendiente de Cubiqa
      suffix: "+",
      label: "Proyectos",
    },
    {
      value: 50, // TODO: dato real pendiente de Cubiqa
      suffix: "+",
      label: "Clientes",
    },
    {
      value: 8, // TODO: dato real pendiente de Cubiqa
      suffix: "K",
      label: "Resolución",
    },
  ] satisfies Stat[],

  // --- Unidades disponibles (fallback estático; en runtime las hidrata Airtable) ---
  units: [] satisfies Unit[],

  // --- Tours 360° (recorridos virtuales Kuula) ---
  // Formato /share/collection/{ID} es el embed oficial; /post/ bloquea iframes via X-Frame-Options
  tours360: [
    {
      id: "depto-1-a",
      title: "Depto 1 - A",
      description: "3 Ambientes",
      url: "https://kuula.co/share/collection/7Mntx?logo=1&info=1&fs=1&vr=0&thumbs=0&inst=es&title=0&desc=0",
    },
    {
      id: "depto-1-b",
      title: "Depto 1 - B",
      description: "3 Ambientes",
      url: "https://kuula.co/share/collection/7M64p?logo=1&info=1&fs=1&vr=0&thumbs=0&inst=es&title=0&desc=0",
    },
    {
      id: "depto-3-c",
      title: "Depto 3 - C",
      description: "2 Ambientes",
      url: "https://kuula.co/share/collection/7MntQ?logo=1&info=1&fs=1&vr=0&thumbs=0&inst=es&title=0&desc=0",
    },
  ] satisfies Tour360[],

  // --- Galería de imágenes (projects section) ---
  gallery: [
    {
      id: "departamentos",
      name: "Departamentos",
      iconName: "Building2",
      subtitle: "Espacios diseñados para vivir", // TODO: copy pendiente de cliente
      description:
        "Cada unidad combina diseño contemporáneo con funcionalidad. Amplios ambientes con luz natural y terminaciones de primera calidad.", // TODO: copy pendiente de cliente
      images: [
        "/images/cbq_ab_am_view_03.jpg",
        "/images/cbq_ab_am_view_04.jpg",
        "/images/cbq_ab_am_view_05.jpg",
      ],
    },
    {
      id: "espacios-comunes",
      name: "Espacios Comunes",
      iconName: "Sparkles",
      subtitle: "Experiencias que elevan tu estilo de vida", // TODO: copy pendiente de cliente
      description:
        "Espacios comunes pensados para el disfrute y el bienestar. Cada espacio está diseñado para enriquecer tu día a día.", // TODO: copy pendiente de cliente
      images: [
        "/images/cbq_ab_am_view_06.jpg",
      ],
    },
  ] satisfies GalleryCategory[],

  // --- POIs cercanos al proyecto ---
  nearbyPlaces: [
    { name: "Plaza Dorrego", distance: "En la puerta del edificio", time: "1 min", iconName: "Trees" },
    { name: "Estación Victoria", distance: "Tren Mitre", time: "5 min", iconName: "Train" },
    { name: "Av. Presidente Perón", distance: "Acceso a autopista y centro", time: "2 min", iconName: "Car" },
    { name: "Colectivos 60, 203, 365 y 371", distance: "Paradas en la puerta", time: "1 min", iconName: "Bus" },
    { name: "Gastronomía y comercios", distance: "A la redonda del edificio", time: "3 min", iconName: "Utensils" },
    { name: "Centro médico privado", distance: "Sobre Ing. White", time: "2 min", iconName: "Stethoscope" },
  ] satisfies NearbyPlace[],

  // --- Horarios de atención comercial ---
  officeHours: {
    // TODO: horarios reales pendientes de AR Building
    weekdays: "Lunes a Viernes: 9:00 - 18:00",
    saturday: "Sábados: 10:00 - 14:00",
    sunday: "Domingos: Cerrado",
  } satisfies OfficeHours,

  // --- Tipologías (carrusel de planos) ---
  // 15 deptos en 3 pisos × 5 unidades por piso (tipologías A–E en Airtable).
  // Los PDFs originales viven en /public/AMBROSONI/Depto N Ambrosoni.pdf;
  // los PNGs se generan con scripts/pdf-to-png.mjs (pdfjs-dist + Playwright).
  // Mapeo deducido: Depto 1 = A/B (mirror), Depto 2 = D/E (mirror), Depto 3 = C.
  // m² tomados de Airtable. TODO: confirmar el mapeo PDF↔tipología con AR Building.
  typologies: [
    {
      id: "depto-1",
      name: "Depto 1 - Tipologías A y B",
      totalArea: 81, // 65 cub + 16 desc (tipología A/B)
      coveredArea: 65,
      bedrooms: 2,
      bathrooms: 2,
      planImage: "/AMBROSONI/depto-1-plano.png",
      description: "",
    },
    {
      id: "depto-2",
      name: "Depto 2 - Tipologías D y E",
      totalArea: 65, // 53 cub + 12 desc (tipología D/E)
      coveredArea: 53,
      bedrooms: 1,
      bathrooms: 2,
      planImage: "/AMBROSONI/depto-2-plano.png",
      description: "",
    },
    {
      id: "depto-3",
      name: "Depto 3 - Tipología C",
      totalArea: 60, // 53 cub + 7.5 desc (tipología C, redondeado)
      coveredArea: 53,
      bedrooms: 1,
      bathrooms: 2,
      planImage: "/AMBROSONI/depto-3-plano.png",
      description: "",
    },
  ] satisfies Typology[],
} as const
