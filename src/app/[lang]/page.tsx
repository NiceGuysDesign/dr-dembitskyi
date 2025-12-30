import Hero from "@/components/home-page/hero";
import HeroImageSection from "@/components/home-page/hero-image-section";
import ServicesSection from "@/components/home-page/services-section";
import PackagesSection from "@/components/home-page/packages-section";
import CasesSection from "@/components/home-page/cases-section";
import CTASection from "@/components/home-page/cta-section";

export default function Home() {
  return ( 
    <main>
      <Hero />
      <ServicesSection />
      <CTASection />
      <PackagesSection />
      <CasesSection />
      <HeroImageSection />
    </main>
  );
}
