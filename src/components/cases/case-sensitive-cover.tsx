"use client";

import CaseCoverImage from "./case-cover-image";
import CaseSensitiveMedia from "./case-sensitive-media";

type CaseSensitiveCoverProps = {
  src: string | null | undefined;
  alt: string;
  href?: string;
  revealOnly?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  unoptimized?: boolean;
};

export default function CaseSensitiveCover({
  src,
  alt,
  href,
  revealOnly = false,
  containerClassName = "relative w-full h-full",
  imageClassName = "object-cover",
  unoptimized = false,
}: CaseSensitiveCoverProps) {
  return (
    <CaseSensitiveMedia
      href={href}
      revealOnly={revealOnly}
      className={containerClassName}
    >
      <CaseCoverImage
        src={src}
        alt={alt}
        className={imageClassName}
        containerClassName="relative w-full h-full"
        unoptimized={unoptimized}
      />
    </CaseSensitiveMedia>
  );
}
