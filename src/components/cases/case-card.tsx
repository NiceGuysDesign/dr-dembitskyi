"use client";

import Link from "next/link";
import Image from "next/image";
import { Case } from "@/strapi/cases";

interface CaseCardProps {
  caseItem: Case;
  lang: string;
}

export default function CaseCard({ caseItem, lang }: CaseCardProps) {
  return (
    <Link href={`/${lang}/cases/${caseItem.slug}`} className="block group">
      <div className="w-full flex flex-col">
        {/* Image container */}
        <div className="relative w-full h-[306px] overflow-hidden">
          <Image
            src={caseItem.image}
            alt={caseItem.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Arrow button overlay */}
          <div className="absolute top-[10px] right-[10px] z-10">
            <div className="rotate-0 group-hover:rotate-[45deg] transition-transform duration-300">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
              >
                <rect
                  x="0.5"
                  y="55.5"
                  width="55"
                  height="55"
                  rx="27.5"
                  transform="rotate(-90 0.5 55.5)"
                  stroke="url(#paint0_linear_482_580)"
                />
                <path
                  d="M24.2892 24H32M32 24V31.6867M32 24L24 32"
                  stroke="url(#paint1_linear_482_580)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_482_580"
                    x1="28"
                    y1="56"
                    x2="28"
                    y2="112"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_482_580"
                    x1="28"
                    y1="24"
                    x2="28"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6">
          <h3 className="font-manrope font-bold text-[22px] leading-[140%] tracking-[-0.02em] text-[var(--color-text-heading)]">
            {caseItem.title}
          </h3>
          {/* Description */}
          {caseItem.description && (
            <p className="font-manrope font-medium text-sm leading-[160%] tracking-[-0.01em] text-[var(--color-text-primary)]/70 mt-3 line-clamp-3">
              {caseItem.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
