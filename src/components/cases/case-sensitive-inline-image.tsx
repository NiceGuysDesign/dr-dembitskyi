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

/** Контейнер під реальний розмір фото (не на всю ширину колонки) */
export function SensitiveContentImageFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full justify-center my-4 md:my-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default function CaseSensitiveInlineImage({
  src,
  alt,
  imageKey,
  sensitive = false,
}: CaseSensitiveInlineImageProps) {
  const image = (
    <div className="relative inline-block max-w-full overflow-hidden rounded">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        className="block h-auto max-h-[50vh] w-auto max-w-full"
        sizes="(max-width: 768px) 100vw, 1100px"
      />
    </div>
  );

  if (!sensitive) {
    return (
      <SensitiveContentImageFrame>
        <div key={imageKey}>{image}</div>
      </SensitiveContentImageFrame>
    );
  }

  return (
    <SensitiveContentImageFrame>
      <CaseSensitiveMedia key={imageKey} revealOnly className="inline-block max-w-full">
        {image}
      </CaseSensitiveMedia>
    </SensitiveContentImageFrame>
  );
}
