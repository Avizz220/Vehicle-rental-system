import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSearchSection } from '@/components/home/HeroSearchSection'
import { TrustedSection } from '@/components/home/TrustedSection'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSearchSection />
      <TrustedSection />
      <FeaturedVehicles />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}
