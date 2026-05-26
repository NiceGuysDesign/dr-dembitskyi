"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import WaterMark from "../../../public/icons/water-mark";

type CaseSensitiveMediaProps = {
  children: React.ReactNode;
  className?: string;
  /** Card list: permanent light blur (same strength as detail), no label, one tap opens the case. */
  cardLink?: string;
  /** Single click removes blur (case detail page). */
  revealOnly?: boolean;
  /** Carousel: div instead of Link so drag events reach the carousel. */
  swipeable?: boolean;
};

/** Blur stack from Figma: blur(12px); optional bleed for carousel cards */
function BlurredCasePreview({
  children,
  extendBlur = false,
}: {
  children: React.ReactNode;
  extendBlur?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={
          extendBlur
            ? "absolute left-[-21%] right-[-4%] top-[-3.5%] bottom-[-3.5%]"
            : "absolute inset-0"
        }
      >
        <div className="relative h-full w-full blur-[12px]">{children}</div>
      </div>
    </div>
  );
}

function SensitiveCaseBlurredOverlay({
  captionLine2Key = "cases.sensitiveContentLine2",
}: {
  captionLine2Key?: string;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute left-[-2%] top-[6%] z-10 w-[68%] mix-blend-overlay">
        <WaterMark className="h-auto w-full" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-start px-5 pb-5">
        <p className="font-manrope text-[14px] font-semibold leading-[150%] tracking-[-0.03em] text-white">
          {t("cases.sensitiveContentLine1")}
          <br />
          {t(captionLine2Key)}
        </p>
      </div>
    </>
  );
}

/** Blur + logo + text поверх фото; розмір задає невидимий шар у потоці документа */
function SensitiveCaseBlurredStack({
  children,
  captionLine2Key = "cases.sensitiveContentLine2",
  sizeClassName = "",
  extendBlur = false,
}: {
  children: React.ReactNode;
  captionLine2Key?: string;
  sizeClassName?: string;
  /** Carousel/cards: bleed past edges. Case content: exact photo bounds. */
  extendBlur?: boolean;
}) {
  const rootClass = extendBlur
    ? `relative w-full ${sizeClassName}`
    : `relative inline-block max-w-full ${sizeClassName}`;

  return (
    <div className={rootClass}>
      <div className="invisible pointer-events-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <BlurredCasePreview extendBlur={extendBlur}>{children}</BlurredCasePreview>
        <SensitiveCaseBlurredOverlay captionLine2Key={captionLine2Key} />
      </div>
    </div>
  );
}

export default function CaseSensitiveMedia({
  children,
  className = "",
  cardLink,
  revealOnly = false,
  swipeable = false,
}: CaseSensitiveMediaProps) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealed(true);
  }, []);

  if (cardLink && !swipeable) {
    return (
      <Link
        href={cardLink}
        draggable={false}
        className={`relative block w-full h-full overflow-hidden select-none ${className}`}
      >
        <SensitiveCaseBlurredStack sizeClassName="h-full" extendBlur>
          {children}
        </SensitiveCaseBlurredStack>
      </Link>
    );
  }

  if (swipeable) {
    return (
      <div
        className={`relative block w-full h-full overflow-hidden select-none ${className}`}
      >
        <SensitiveCaseBlurredStack sizeClassName="h-full" extendBlur>
          {children}
        </SensitiveCaseBlurredStack>
      </div>
    );
  }

  if (revealOnly) {
    return (
      <div className={`inline-block max-w-full ${className}`}>
        {revealed ? (
          children
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0"
            aria-label={t("cases.sensitiveRevealLine2")}
          >
            <SensitiveCaseBlurredStack captionLine2Key="cases.sensitiveRevealLine2">
              {children}
            </SensitiveCaseBlurredStack>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>{children}</div>
  );
}
