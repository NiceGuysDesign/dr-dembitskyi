"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BlogPost } from "@/strapi/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const params = useParams();
  const lang = (params.lang as string) || "uk";

  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="block group">
      <div className="w-full flex flex-col">
        {/* Image container */}
        <div className="relative w-full h-[306px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Date overlay */}
          <div className="absolute top-5 left-5 z-10">
            <span className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] uppercase text-white opacity-50">
              {post.publishedAt}
            </span>
          </div>

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
          <h3 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)]">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
