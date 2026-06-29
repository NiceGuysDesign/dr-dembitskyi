import HeroContent from "./hero-content";
import HeroLcpImage from "./hero-lcp-image";
import { HeroData } from "@/strapi/hero";

interface HeroProps {
  heroData: HeroData;
  lang: string;
}

export default function Hero({ heroData, lang }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden pt-[100px] pb-10 md:pb-0 md:h-[90vh] lg:h-screen md:pt-[120px]">
      <div className="relative px-[10px] md:px-5 md:h-full">
        <div className="relative flex flex-col md:flex-row justify-center items-stretch md:items-start gap-6 md:gap-0 md:h-full">
          <HeroContent
            title={heroData.title}
            description={heroData.description}
            lang={lang}
          />
          <HeroLcpImage src={heroData.image} alt={heroData.imageAlt} />
        </div>
      </div>
    </section>
  );
}
