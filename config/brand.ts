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

export type Amenity = {
  id: string
  iconName: string // nombre del icono de lucide-react (se resuelve en el componente)
  title: string
  description: string
  details: string
  image: string
}

export type UnitStatus = "available" | "reserved" | "sold"

export type Unit = {
  floor: number
  unit: string
  rooms: number
  sqm: number
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

// ---------------------------------------------------------------------------
// Brand data
// ---------------------------------------------------------------------------

export const brand = {
  // --- Empresa y proyecto ---
  company: "AR Building",
  project: "AMBROSONI",
  template: "NOIR",

  // --- Logo ---
  // TODO: logo AMBROSONI pendiente de Cubiqa
  logo: "/images/arbuilding-logo.png",
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

  // --- Navegacion ---
  navItems: [
    { label: "Concepto", href: "#concepto" },
    { label: "Experiencia 360°", href: "#experiencia" },
    { label: "Galería", href: "#galeria" },
    { label: "Amenidades", href: "#amenidades" },
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

  // --- Amenities ---
  amenities: [
    {
      id: "pileta",
      iconName: "Waves",
      title: "Pileta", // TODO: contenido real pendiente de Cubiqa
      description: "Pileta descubierta con solarium y deck de madera", // TODO: contenido real pendiente de Cubiqa
      details: "Zona de descanso con reposeras y duchas", // TODO: contenido real pendiente de Cubiqa
      image: "/images/View_06_01.jpg", // TODO: asset AMBROSONI pendiente
    },
    {
      id: "gimnasio",
      iconName: "Dumbbell",
      title: "Gimnasio", // TODO: contenido real pendiente de Cubiqa
      description: "Equipamiento completo para entrenamiento", // TODO: contenido real pendiente de Cubiqa
      details: "Zona de pesas, cardio y funcional", // TODO: contenido real pendiente de Cubiqa
      image: "/images/View_05_01.jpg", // TODO: asset AMBROSONI pendiente
    },
    {
      id: "sum",
      iconName: "Users",
      title: "SUM", // TODO: contenido real pendiente de Cubiqa
      description: "Salón de usos múltiples para eventos", // TODO: contenido real pendiente de Cubiqa
      details: "Capacidad para 40 personas, cocina integrada", // TODO: contenido real pendiente de Cubiqa
      image: "/images/View_03_01.jpg", // TODO: asset AMBROSONI pendiente
    },
    {
      id: "cochera",
      iconName: "Car",
      title: "Cocheras", // TODO: contenido real pendiente de Cubiqa
      description: "Cocheras cubiertas con acceso directo", // TODO: contenido real pendiente de Cubiqa
      details: "Seguridad 24/7 y acceso por control remoto", // TODO: contenido real pendiente de Cubiqa
      image: "/images/View_05_01.jpg", // TODO: asset AMBROSONI pendiente
    },
    {
      id: "seguridad",
      iconName: "Shield",
      title: "Seguridad", // TODO: contenido real pendiente de Cubiqa
      description: "Vigilancia perimetral y control de accesos", // TODO: contenido real pendiente de Cubiqa
      details: "Cámaras HD, portero eléctrico, cerco perimetral", // TODO: contenido real pendiente de Cubiqa
      image: "/images/View_06_01.jpg", // TODO: asset AMBROSONI pendiente
    },
    {
      id: "parrillas",
      iconName: "Flame",
      title: "Parrillas", // TODO: contenido real pendiente de Cubiqa
      description: "Sector de parrillas con quincho cubierto", // TODO: contenido real pendiente de Cubiqa
      details: "Dos parrillas equipadas con mesada y bacha", // TODO: contenido real pendiente de Cubiqa
      image: "/images/View_03_01.jpg", // TODO: asset AMBROSONI pendiente
    },
  ] satisfies Amenity[],

  // --- Unidades disponibles ---
  units: [
    { floor: 6, unit: "A", rooms: 2, sqm: 55, status: "available", price: "USD 85.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 6, unit: "B", rooms: 3, sqm: 75, status: "reserved", price: "USD 110.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 5, unit: "A", rooms: 2, sqm: 55, status: "available", price: "USD 82.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 5, unit: "B", rooms: 3, sqm: 75, status: "sold", price: "USD 108.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 4, unit: "A", rooms: 2, sqm: 55, status: "available", price: "USD 80.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 4, unit: "B", rooms: 4, sqm: 95, status: "available", price: "USD 145.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 3, unit: "A", rooms: 3, sqm: 75, status: "reserved", price: "USD 105.000" }, // TODO: dato real pendiente de Cubiqa
    { floor: 3, unit: "B", rooms: 4, sqm: 95, status: "available", price: "USD 140.000" }, // TODO: dato real pendiente de Cubiqa
  ] satisfies Unit[],

  // --- Tours 360° (recorridos virtuales Kuula) ---
  tours360: [
    {
      id: "2-ambientes",
      title: "2 Ambientes",
      description: "Unidad funcional con balcón y vista abierta", // TODO: copy pendiente de cliente
      url: null, // TODO: URL Kuula pendiente de Cubiqa
    },
    {
      id: "3-ambientes",
      title: "3 Ambientes",
      description: "Amplitud y funcionalidad para familias", // TODO: copy pendiente de cliente
      url: null, // TODO: URL Kuula pendiente de Cubiqa
    },
    {
      id: "4-ambientes",
      title: "4 Ambientes",
      description: "El espacio premium para tu familia", // TODO: copy pendiente de cliente
      url: null, // TODO: URL Kuula pendiente de Cubiqa
    },
    {
      id: "amenities",
      title: "Amenities",
      description: "Espacios comunes diseñados para disfrutar", // TODO: copy pendiente de cliente
      url: null, // TODO: URL Kuula pendiente de Cubiqa
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
        "/images/View_04_01.jpg", // TODO: asset AMBROSONI pendiente
        "/images/View_01_01.jpg", // TODO: asset AMBROSONI pendiente
        "/images/View_02_01.jpg", // TODO: asset AMBROSONI pendiente
        "/images/cbq_gbd_ath_View_03.jpg", // TODO: asset AMBROSONI pendiente
        "/images/cbq_gbd_ath_View_12.jpg", // TODO: asset AMBROSONI pendiente
      ],
    },
    {
      id: "amenities",
      name: "Amenities",
      iconName: "Sparkles",
      subtitle: "Experiencias que elevan tu estilo de vida", // TODO: copy pendiente de cliente
      description:
        "Espacios comunes pensados para el disfrute y el bienestar. Cada amenity está diseñado para enriquecer tu día a día.", // TODO: copy pendiente de cliente
      images: [
        "/images/View_05_01.jpg", // TODO: asset AMBROSONI pendiente
        "/images/View_06_01.jpg", // TODO: asset AMBROSONI pendiente
        "/images/View_03_01.jpg", // TODO: asset AMBROSONI pendiente
        "/images/cbq_gbd_ath_View_07.jpg", // TODO: asset AMBROSONI pendiente
        "/images/cbq_gbd_ath_View_08.jpg", // TODO: asset AMBROSONI pendiente
      ],
    },
  ] satisfies GalleryCategory[],

  // --- POIs cercanos al proyecto ---
  nearbyPlaces: [
    // TODO: POIs cercanos a AMBROSONI pendientes — no conozco el barrio, placeholders genéricos
    { name: "Centro Comercial", distance: "1.0km", time: "12 min", iconName: "MapPin" }, // TODO: POI real pendiente
    { name: "Estación de Tren", distance: "800m", time: "10 min", iconName: "Train" }, // TODO: POI real pendiente
    { name: "Centro de Salud", distance: "1.5km", time: "6 min", iconName: "Car" }, // TODO: POI real pendiente
    { name: "Parque / Plaza", distance: "500m", time: "6 min", iconName: "MapPin" }, // TODO: POI real pendiente
  ] satisfies NearbyPlace[],

  // --- Horarios de atención comercial ---
  officeHours: {
    // TODO: horarios reales pendientes de AR Building
    weekdays: "Lunes a Viernes: 9:00 - 18:00",
    saturday: "Sábados: 10:00 - 14:00",
    sunday: "Domingos: Cerrado",
  } satisfies OfficeHours,

  // --- Tipologías (carrusel de planos) ---
  typologies: [
    {
      id: "2-ambientes",
      name: "2 Ambientes",
      totalArea: 0, // TODO: dato real pendiente de Cubiqa
      coveredArea: 0, // TODO: dato real pendiente de Cubiqa
      bedrooms: 1, // TODO: dato real pendiente de Cubiqa
      bathrooms: 1, // TODO: dato real pendiente de Cubiqa
      planImage: "/images/plans/ambrosoni-2amb.jpg", // TODO: asset AMBROSONI pendiente
      description: "Unidad funcional ideal para parejas o inversores", // TODO: copy pendiente de cliente
    },
    {
      id: "3-ambientes",
      name: "3 Ambientes",
      totalArea: 0, // TODO: dato real pendiente de Cubiqa
      coveredArea: 0, // TODO: dato real pendiente de Cubiqa
      bedrooms: 2, // TODO: dato real pendiente de Cubiqa
      bathrooms: 1, // TODO: dato real pendiente de Cubiqa
      planImage: "/images/plans/ambrosoni-3amb.jpg", // TODO: asset AMBROSONI pendiente
      description: "Amplitud y funcionalidad para familias", // TODO: copy pendiente de cliente
    },
    {
      id: "4-ambientes",
      name: "4 Ambientes",
      totalArea: 0, // TODO: dato real pendiente de Cubiqa
      coveredArea: 0, // TODO: dato real pendiente de Cubiqa
      bedrooms: 3, // TODO: dato real pendiente de Cubiqa
      bathrooms: 2, // TODO: dato real pendiente de Cubiqa
      planImage: "/images/plans/ambrosoni-4amb.jpg", // TODO: asset AMBROSONI pendiente
      description: "El espacio premium para tu familia", // TODO: copy pendiente de cliente
    },
  ] satisfies Typology[],
} as const
