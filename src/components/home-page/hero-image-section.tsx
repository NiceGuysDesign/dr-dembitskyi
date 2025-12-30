"use client";

import Image from "next/image";

export default function HeroImageSection() {
  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[865px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute left-0 top-0 w-full h-full">
        <Image
          src="/images/image 41.png"
          fill
          alt="Dr. Dembitskyi"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Text Overlay */}
      <div className="absolute left-0 md:left-[-49px] top-[20px] sm:top-[30px] md:top-[40px] lg:top-[62px] w-full md:w-[1624.2px] h-auto px-[10px] md:px-0">
        <h2
          className="font-manrope font-bold text-[12vw] sm:text-[15vw] md:text-[120px] lg:text-[180px] xl:text-[220px] leading-[100%] tracking-[-0.05em] text-white m-0"
          style={{ mixBlendMode: "soft-light" }}
        >
          Dr. Dembitskyi
        </h2>
      </div>
    </section>
  );
}
