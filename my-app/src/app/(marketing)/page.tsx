import { HeroSection } from '@/components/marketing/hero-section'
import { MeasurementSection } from '@/components/marketing/measurement-section'
import { ProductsSection } from '@/components/marketing/products-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { CTASection } from '@/components/marketing/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MeasurementSection />
      <ProductsSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}