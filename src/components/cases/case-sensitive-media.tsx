"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

type CaseSensitiveMediaProps = {
  children: React.ReactNode;
  className?: string;
  /** Card list: permanent blur (same strength as detail), no label, one tap opens the case. */
  cardLink?: string;
  /** Single click removes blur (case detail page). */
  revealOnly?: boolean;
};

export default function CaseSensitiveMedia({
  children,
  className = "",
  cardLink,
  revealOnly = false,
}: CaseSensitiveMediaProps) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealed(true);
  }, []);

  if (cardLink) {
    return (
      <Link
        href={cardLink}
        className={`relative block w-full h-full overflow-hidden ${className}`}
      >
        <div className="relative w-full h-full blur-lg scale-[1.02]">
          {children}
        </div>
      </Link>
    );
  }

  const label = !revealed ? t("cases.showImage") : null;
  const showOverlay = revealOnly && !revealed && !!label;

  const inner = (
    <>
      <div
        className={`relative w-full h-full transition-[filter] duration-300 ${
          revealed ? "blur-0" : "blur-lg scale-[1.02]"
        }`}
      >
        {children}
      </div>

      {showOverlay && label && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#353556]/25 px-4 pointer-events-none">
          <span className="font-manrope font-semibold text-sm md:text-base leading-[140%] tracking-[-0.02em] text-white text-center drop-shadow-md max-w-[220px]">
            {label}
          </span>
        </div>
      )}
    </>
  );

  if (revealOnly && revealed) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative block w-full h-full overflow-hidden cursor-pointer border-0 p-0 bg-transparent text-left ${className}`}
      aria-label={label ?? undefined}
    >
      {inner}
    </button>
  );
}
