import AboutPageClient from "@/components/about/about-page-client";
import { getAbout } from "@/strapi/about";

type AboutPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const aboutData = await getAbout(lang);

  if (!aboutData) {
    return <div>Дані про лікаря не знайдено</div>;
  }

  return <AboutPageClient aboutData={aboutData} />;
}
