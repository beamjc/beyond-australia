import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/shared/HeroSection'
import ServicesSection from '@/components/shared/ServicesSection'
import WHMJourneyTeaser from '@/components/shared/WHMJourneyTeaser'
import WHMSection from '@/components/whm/WHMSection'
import StudySection from '@/components/study/StudySection'
import VisaPathwaySection from '@/components/visa/VisaPathwaySection'
import EventsSection from '@/components/shared/EventsSection'
import LatestArticlesSection from '@/components/articles/LatestArticlesSection'
import ProofStatsSection from '@/components/shared/ProofStatsSection'
import CTABanner from '@/components/shared/CTABanner'
import Footer from '@/components/shared/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WHMJourneyTeaser />
      <WHMSection />
      <StudySection />
      <VisaPathwaySection />
      <EventsSection />
      <LatestArticlesSection />
      <ProofStatsSection />
      <CTABanner />
      <Footer />
    </main>
  )
}
