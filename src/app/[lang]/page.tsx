import Hero from "@/components/home-page/hero";
import HeroImageSection from "@/components/home-page/hero-image-section";
import ServicesSection from "@/components/home-page/services-section";
import PackagesSection from "@/components/home-page/packages-section";
import CasesSection from "@/components/home-page/cases-section";
import CTASection from "@/components/home-page/cta-section";
import { getCases } from "@/strapi/cases";
import { getHero } from "@/strapi/hero";
import { getPackageServices } from "@/strapi/package-service";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { lang } = await params;
  const cases = await getCases(lang);
  const heroData = await getHero(lang);
  const packagesData = await getPackageServices(lang);

  if (!heroData) {
    return <div>Дані Hero не знайдено</div>;
  }

  return (
    <main>
      <Hero heroData={heroData} lang={lang} />
      <ServicesSection lang={lang} />
      <CTASection />
      <PackagesSection packagesData={packagesData} lang={lang} />
      <CasesSection casesData={cases} lang={lang} />
      <HeroImageSection />
    </main>
  );
}
