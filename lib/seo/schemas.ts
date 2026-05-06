// ============================================================================
// JSON-LD builders para AMBROSONI
// Toda la data viene de config/brand.ts — no hardcodear nada aqui.
// Pattern espejo del setup de Edificio MERCED, adaptado al modelo
// brand-config-driven multi-tenant de Cubiqa.
// ============================================================================

import { brand } from "@/config/brand"

// SITE_URL como fallback al de brand.seo.siteUrl si no hay env var.
// La env tiene prioridad para staging vs prod.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? brand.seo.siteUrl

const ORG_ID = `${SITE_URL}/#organization`
const LOCALBUSINESS_ID = `${SITE_URL}/#localbusiness`
const APARTMENTCOMPLEX_ID = `${SITE_URL}/#apartmentcomplex`
const WEBSITE_ID = `${SITE_URL}/#website`

// Genera OpeningHoursSpecification[] desde brand.officeHours.
// brand guarda strings ("Lunes a Viernes: 9:00 - 18:00") y los
// horarios reales estan parseados aqui contra esos strings.
function openingHoursSpec() {
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "14:00",
    },
  ]
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: brand.location.address,
    addressLocality: brand.location.area,
    addressRegion: brand.location.city,
    postalCode: brand.seo.postalCode,
    addressCountry: "AR",
  }
}

function contactPoints() {
  return brand.phones.map((p, idx) => ({
    "@type": "ContactPoint",
    telephone: p.number,
    contactType: idx === 0 ? "sales" : "customer service",
    name: p.name,
    availableLanguage: "Spanish",
    hoursAvailable: openingHoursSpec(),
  }))
}

function sameAs() {
  return [brand.instagram.url]
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: brand.company,
  alternateName: brand.seo.schema.alternateName,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}${brand.logo}`,
  },
  contactPoint: contactPoints(),
  address: postalAddress(),
  email: brand.email,
  telephone: brand.phones[0]?.number,
  sameAs: sameAs(),
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": LOCALBUSINESS_ID,
  name: `${brand.project} — ${brand.company}`,
  description: brand.seo.schema.description,
  url: SITE_URL,
  telephone: brand.phones[0]?.number,
  email: brand.email,
  address: postalAddress(),
  geo: {
    "@type": "GeoCoordinates",
    latitude: brand.seo.geo.latitude,
    longitude: brand.seo.geo.longitude,
  },
  openingHoursSpecification: openingHoursSpec(),
  priceRange: brand.seo.schema.priceRange,
  image: `${SITE_URL}${brand.seo.ogImage}`,
  parentOrganization: { "@id": ORG_ID },
  areaServed: {
    "@type": "City",
    name: brand.location.area,
    containedInPlace: {
      "@type": "State",
      name: brand.location.city,
    },
  },
  sameAs: sameAs(),
}

export const apartmentComplexSchema = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  "@id": APARTMENTCOMPLEX_ID,
  name: brand.project,
  description: brand.seo.schema.description,
  url: SITE_URL,
  image: `${SITE_URL}${brand.seo.ogImage}`,
  numberOfAccommodationUnits: {
    "@type": "QuantitativeValue",
    value: brand.seo.schema.totalUnits,
  },
  petsAllowed: brand.seo.schema.petsAllowed,
  tourBookingPage: `${SITE_URL}/#contacto`,
  address: postalAddress(),
  geo: {
    "@type": "GeoCoordinates",
    latitude: brand.seo.geo.latitude,
    longitude: brand.seo.geo.longitude,
  },
  numberOfRooms: brand.seo.schema.totalUnits,
  amenityFeature: brand.seo.schema.amenities.map((amenity) => ({
    "@type": "LocationFeatureSpecification",
    name: amenity,
    value: true,
  })),
  containedInPlace: {
    "@type": "City",
    name: brand.location.area,
    containedInPlace: {
      "@type": "State",
      name: brand.location.city,
      containedInPlace: { "@type": "Country", name: brand.location.country },
    },
  },
  makesOffer: brand.seo.schema.offers.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Apartment",
      name: offer.name,
      numberOfRooms: offer.rooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: offer.coveredSqm,
        unitCode: "MTK",
      },
    },
  })),
  additionalProperty: brand.seo.schema.additionalProperties.map((p) => ({
    "@type": "PropertyValue",
    name: p.name,
    value: p.value,
  })),
}

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: brand.seo.schema.siteName,
  url: SITE_URL,
  description: brand.seo.schema.description,
  inLanguage: brand.seo.schema.htmlLang,
  publisher: { "@id": ORG_ID },
}

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
  ],
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: brand.seo.faq.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
}

// Lista en orden de inyeccion en <head>.
export const allSchemas = [
  organizationSchema,
  localBusinessSchema,
  apartmentComplexSchema,
  webSiteSchema,
  breadcrumbSchema,
  faqSchema,
]
