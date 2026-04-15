import { HeroSection } from "@/components/hero-section"
import { ConceptSection } from "@/components/concept-section"
import { ProjectsSection } from "@/components/projects-section"
import { ImmersiveSection } from "@/components/immersive-section"
import { UnitsSection } from "@/components/units-section"
import { TypologiesSection } from "@/components/typologies-section"
import { LocationSection } from "@/components/location-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Page() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background overflow-x-hidden">
        <HeroSection />
        <ConceptSection />
        <ProjectsSection />
        <ImmersiveSection />
        <UnitsSection />
        <TypologiesSection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
