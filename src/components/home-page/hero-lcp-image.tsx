import Image from "next/image";

type HeroLcpImageProps = {
  src: string;
  alt: string;
};

/** Server-rendered LCP image — no lazy load, high fetch priority. */
export default function HeroLcpImage({ src, alt }: HeroLcpImageProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-0 z-10 w-[530px] md:w-[600px] lg:w-[1021px] h-auto max-h-[calc(100vh-120px)] md:max-h-[calc(90vh-120px)] lg:max-h-[calc(100vh-60px)]">
      <Image
        src={src}
        width={1021}
        height={1022}
        alt={alt}
        className="object-contain w-full h-full"
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 600px, 1021px"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-bg-light)] to-transparent w-full h-[400px] md:h-[300px] z-10" />
    </div>
  );
}
