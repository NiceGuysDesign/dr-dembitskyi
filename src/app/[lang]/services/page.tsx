import CTASection2 from "@/components/services/cta-section-2";
import PackagesSection from "@/components/home-page/packages-section";
import ServicesPageClient from "@/components/services/services-page-client";
import { getServices } from "@/strapi/services";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const servicesData = await getServices(lang);

  return (
    <main className="relative w-full min-h-screen">
      {/* Large background title */}
      <div className="absolute top-[46px] right-0 w-fit pointer-events-none z-0">
        <h1 className="font-manrope font-bold text-[120px] md:text-[180px] lg:text-[212px] leading-[100%] tracking-[-0.05em] text-[#353556] opacity-[0.03] text-center">
          Послуги
        </h1>
      </div>

      <div className="relative z-10 px-[10px] md:px-5 pt-[120px] pb-10 md:pb-20">
        <ServicesPageClient servicesData={servicesData} />
      </div>

      {/* Packages Section */}
      <PackagesSection />

      {/* CTA Section 2 */}
      <CTASection2 />
    </main>
  );
}
