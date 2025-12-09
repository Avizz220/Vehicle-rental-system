import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSearchSection } from '@/components/home/HeroSearchSection'
import { VehicleCategories } from '@/components/home/VehicleCategories'
import { TrustedSection } from '@/components/home/TrustedSection'
import { Testimonials } from '@/components/home/Testimonials'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSearchSection />
      <VehicleCategories />
      <TrustedSection />
      <Testimonials />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}
