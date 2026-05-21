import HeroContent from "./hero-content";
import HeroLcpImage from "./hero-lcp-image";
import { HeroData } from "@/strapi/hero";

interface HeroProps {
  heroData: HeroData;
  lang: string;
}

export default function Hero({ heroData, lang }: HeroProps) {
  return (
    <section className="relative w-full h-[100vh] md:h-[90vh] lg:h-screen overflow-hidden pt-[100px] md:pt-[120px]">
      <div className="relative px-[10px] md:px-5 h-full">
        <div className="relative flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-0 h-full">
          <HeroContent
            title={heroData.title}
            description={heroData.description}
            lang={lang}
          />
          <HeroLcpImage src={heroData.image} alt={heroData.imageAlt} />
        </div>
      </div>
      <div className="absolute bottom-20 md:bottom-0 bg-gradient-to-t from-[var(--color-bg-light)] to-transparent w-full h-[60vh] md:h-[300px] z-10" />
    </section>
  );
}
