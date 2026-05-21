import { preload } from "react-dom";
import { JsonLd } from "@/components/schema/json-ld";
import { buildMedicalClinicJsonLd } from "@/lib/schema/medical-clinic";
import Hero from "@/components/home-page/hero";
import HeroImageSection from "@/components/home-page/hero-image-section";
import ServicesSection from "@/components/home-page/services-section";
import PackagesSection from "@/components/home-page/packages-section";
// import CasesSection from "@/components/home-page/cases-section";
import CTASection from "@/components/home-page/cta-section";
// import { getCases } from "@/strapi/cases";
// import { getCaseCategories } from "@/strapi/case-categories";
import { getHero } from "@/strapi/hero";
import { getPackageServices } from "@/strapi/package-service";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { lang } = await params;
  const [heroData, packagesData] = await Promise.all([
    getHero(lang),
    getPackageServices(lang),
  ]);

  if (!heroData) {
    return <div>Дані Hero не знайдено</div>;
  }

  if (heroData.image) {
    preload(heroData.image, { as: "image", fetchPriority: "high" });
  }

  return (
    <main>
      <JsonLd data={buildMedicalClinicJsonLd(lang)} />
      <Hero heroData={heroData} lang={lang} />
      <ServicesSection lang={lang} />
      <CTASection />
      <PackagesSection packagesData={packagesData} lang={lang} />
      {/* <CasesSection
        casesData={cases}
        filterCategories={filterCategories}
        lang={lang}
      /> */}
      <div className="h-[80px] w-full"></div>
      <HeroImageSection />
    </main>
  );
}
