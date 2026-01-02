import { getCases } from "@/strapi/cases";
import CasesSection from "@/components/home-page/cases-section";
import CTASection2 from "@/components/services/cta-section-2";

type CasesPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CasesPage({ params }: CasesPageProps) {
  const { lang } = await params;
  const cases = await getCases(lang);

  return (
    <main className="relative w-full min-h-screen pt-20">
      <CasesSection casesData={cases} />
      <CTASection2 />
    </main>
  );
}
