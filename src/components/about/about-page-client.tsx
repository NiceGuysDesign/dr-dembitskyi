"use client";

import React from "react";
import Image from "next/image";
import { AboutData } from "@/strapi/about";
import { useTranslation } from "react-i18next";

interface AboutPageClientProps {
  aboutData: AboutData;
}

export default function AboutPageClient({ aboutData }: AboutPageClientProps) {
  const { t } = useTranslation();

  const hasText = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  const hasImage = hasText(aboutData?.image);
  const hasName = hasText(aboutData?.name);
  const hasPosition = hasText(aboutData?.position);
  const hasDescription = hasText(aboutData?.description);

  const education = Array.isArray(aboutData?.education) ? aboutData.education : [];
  const hasEducation = education.length > 0;

  return (
    <main className="relative w-full min-h-screen bg-[#F4F4F5]">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-0">
        {/* Mobile Photo - Shown on mobile, hidden on desktop */}
        {hasImage && (
          <div className="lg:hidden relative w-full h-[60vh] md:h-[70vh] overflow-hidden top-[80px]">
            <Image
              src={aboutData.image}
              alt={hasName ? aboutData.name : "Doctor photo"}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none" />
          </div>
        )}

        {/* Desktop Left Side - Fixed Photo */}
        {hasImage && (
          <div className="hidden lg:block lg:sticky lg:top-[80px] lg:h-screen lg:overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={aboutData.image}
                alt={hasName ? aboutData.name : "Doctor photo"}
                fill
                className="object-cover object-center"
                priority
                unoptimized
              />
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Right Side - Scrollable Content */}
        <div className="w-full px-[10px] md:px-5 lg:px-10 pb-10">
          <div className="max-w-[800px] mx-auto flex flex-col">
            {/* Name and Title - Overlaps photo on mobile */}
            <div className="flex flex-col gap-2 md:gap-5 -mt-[12px] md:-mt-[140px] lg:mt-[20%] relative z-10">
              {hasName && (
                <h1 className="font-manrope font-bold text-[40px] md:text-[50px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {aboutData.name}
                </h1>
              )}
              {hasPosition && (
                <p className="font-manrope font-semibold text-[14px] leading-[150%] tracking-[-0.03em] text-[#353556] opacity-70">
                  {aboutData.position}
                </p>
              )}
            </div>

            {/* About Doctor Section */}
            {hasDescription && (
              <section className="flex flex-col gap-4 md:gap-6 mt-5">
                <h2 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {t("about.aboutDoctor")}
                </h2>
                <p className="font-manrope font-semibold text-[16px] leading-[150%] tracking-[-0.03em] text-black opacity-80">
                  {aboutData.description}
                </p>
              </section>
            )}

            {/* Education Section */}
            {hasEducation && (
              <section className="flex flex-col gap-6 md:gap-8 mt-10">
                <h2 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {t("about.education")}
                </h2>
                <div className="flex flex-col gap-6 md:gap-8">
                  {education
                    .filter((course) => hasText(course?.title) || hasText(course?.location))
                    .map((course) => {
                      // Certificate may exist in the future; hide button when missing.
                      const certUrl =
                        (course as unknown as { certificateUrl?: string }).certificateUrl ||
                        (course as unknown as { certificate?: string }).certificate;
                      const hasCertificate = hasText(certUrl);

                      return (
                        <div key={course.id} className="flex flex-col gap-4 md:gap-6">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
                            <div className="flex flex-col gap-2">
                              {hasText(course.title) && (
                                <h3 className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#353556]/80">
                                  {course.title}
                                </h3>
                              )}
                              {hasText(course.location) && (
                                <p className="font-manrope font-semibold text-[14px] leading-[150%] tracking-[-0.03em] text-black opacity-50">
                                  {course.location}
                                </p>
                              )}
                            </div>

                            {hasCertificate && (
                              <a
                                href={certUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-[18px] rounded-full border border-[#353556] font-inter font-medium text-[16px] leading-[120%] tracking-[-0.02em] text-[#353556] hover:bg-[#353556] hover:text-white transition-colors cursor-pointer w-full md:w-auto md:min-w-[150px] text-center"
                                aria-label={`${t("about.certificate")} - ${course.title}`}
                              >
                                {t("about.certificate")}
                              </a>
                            )}
                          </div>
                          <div className="w-full h-[1px] bg-[#353556] opacity-40"></div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
