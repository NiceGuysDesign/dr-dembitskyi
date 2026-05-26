"use client";

import CaseCoverImage from "./case-cover-image";
import CaseSensitiveMedia from "./case-sensitive-media";

type CaseSensitiveCoverProps = {
  src: string | null | undefined;
  alt: string;
  /** Card mode: permanent light blur + link to case page. */
  cardHref?: string;
  /** Detail page mode: click to reveal image. */
  revealOnly?: boolean;
  /** Carousel slide: no Link wrapper — carousel handles drag. */
  swipeable?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  unoptimized?: boolean;
};

export default function CaseSensitiveCover({
  src,
  alt,
  cardHref,
  revealOnly = false,
  swipeable = false,
  containerClassName = "relative w-full h-full",
  imageClassName = "object-cover",
  unoptimized = false,
}: CaseSensitiveCoverProps) {
  return (
    <CaseSensitiveMedia
      cardLink={cardHref}
      revealOnly={revealOnly}
      swipeable={swipeable}
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
