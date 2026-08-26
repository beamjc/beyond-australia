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
import RevealOnScroll from '@/components/shared/RevealOnScroll'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <RevealOnScroll><ServicesSection /></RevealOnScroll>
      <RevealOnScroll><WHMJourneyTeaser /></RevealOnScroll>
      <RevealOnScroll><WHMSection /></RevealOnScroll>
      <RevealOnScroll><StudySection /></RevealOnScroll>
      <RevealOnScroll><VisaPathwaySection /></RevealOnScroll>
      <RevealOnScroll><EventsSection /></RevealOnScroll>
      <RevealOnScroll><LatestArticlesSection /></RevealOnScroll>
      <RevealOnScroll><ProofStatsSection /></RevealOnScroll>
      <RevealOnScroll><CTABanner /></RevealOnScroll>
      <Footer />
    </main>
  )
}
