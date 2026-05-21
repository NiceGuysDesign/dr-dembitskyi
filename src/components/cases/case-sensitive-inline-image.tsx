"use client";

import Image from "next/image";
import CaseSensitiveMedia from "./case-sensitive-media";

type CaseSensitiveInlineImageProps = {
  src: string;
  alt: string;
  imageKey: string;
  sensitive?: boolean;
  className?: string;
};

export default function CaseSensitiveInlineImage({
  src,
  alt,
  imageKey,
  sensitive = false,
  className = "relative w-full my-4 md:my-6 aspect-video rounded overflow-hidden max-h-[50vh]",
}: CaseSensitiveInlineImageProps) {
  const image = (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    </div>
  );

  if (!sensitive) {
    return <div key={imageKey}>{image}</div>;
  }

  return (
    <CaseSensitiveMedia key={imageKey} revealOnly className="w-full">
      {image}
    </CaseSensitiveMedia>
  );
}
