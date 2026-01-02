import Hero from "@/components/home-page/hero";
import HeroImageSection from "@/components/home-page/hero-image-section";
import ServicesSection from "@/components/home-page/services-section";
import PackagesSection from "@/components/home-page/packages-section";
import CasesSection from "@/components/home-page/cases-section";
import CTASection from "@/components/home-page/cta-section";
import { getCases } from "@/strapi/cases";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { lang } = await params;
  const cases = await getCases(lang);

  return ( 
    <main>
      <Hero />
      <ServicesSection />
      <CTASection />
      <PackagesSection />
      <CasesSection casesData={cases} />
      <HeroImageSection />
    </main>
  );
}
