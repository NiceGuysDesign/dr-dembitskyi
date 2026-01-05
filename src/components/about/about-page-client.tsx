"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function AboutPageClient() {
  const { t } = useTranslation();

  const educationCourses = [
    {
      id: 1,
      name: t("about.education.course1.name") || "Назва курсу",
      location: t("about.education.course1.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
    {
      id: 2,
      name: t("about.education.course2.name") || "Назва курсу",
      location: t("about.education.course2.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
    {
      id: 3,
      name: t("about.education.course3.name") || "Назва курсу",
      location: t("about.education.course3.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
    {
      id: 4,
      name: t("about.education.course3.name") || "Назва курсу",
      location: t("about.education.course3.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
    {
      id: 5,
      name: t("about.education.course3.name") || "Назва курсу",
      location: t("about.education.course3.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
    {
      id: 6,
      name: t("about.education.course3.name") || "Назва курсу",
      location: t("about.education.course3.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
    {
      id: 7,
      name: t("about.education.course3.name") || "Назва курсу",
      location: t("about.education.course3.location") || "Місто, країна, рік",
      certificate: t("about.education.certificate") || "Сертифікат",
    },
  ];

  return (
    <main className="relative w-full min-h-screen bg-[#F4F4F5]">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-0">
        {/* Mobile Photo - Shown on mobile, hidden on desktop */}
        <div className="lg:hidden relative w-full h-[60vh] md:h-[70vh] overflow-hidden top-[80px]">
          <Image
            src="/images/unnamed-2 2.png"
            alt={t("about.doctorName") || "Дембіцький Андрій Русланович"}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none" />
        </div>

        {/* Desktop Left Side - Fixed Photo */}
        <div className="hidden lg:block lg:sticky lg:top-[80px] lg:h-screen lg:overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/unnamed-2 2.png"
              alt={t("about.doctorName") || "Дембіцький Андрій Русланович"}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Side - Scrollable Content */}
        <div className="w-full px-[10px] md:px-5 lg:px-10 pb-10">
          <div className="max-w-[800px] mx-auto flex flex-col">
            {/* Name and Title - Overlaps photo on mobile */}
            <div className="flex flex-col gap-2 md:gap-5 -mt-[12px] md:-mt-[140px] lg:mt-[20%] relative z-10">
              <h1 className="font-manrope font-bold text-[40px] md:text-[50px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {t("about.doctorName") || "Дембіцький Андрій Русланович"}
              </h1>
              <p className="font-manrope font-semibold text-[14px] leading-[150%] tracking-[-0.03em] text-[#353556] opacity-70">
                {t("about.doctorTitle") ||
                  "ДМедН, хірург, засновник центру DARIS"}
              </p>
            </div>

            {/* About Doctor Section */}
            <section className="flex flex-col gap-4 md:gap-6 mt-5">
              <h2 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {t("about.sectionTitle") || "Про лікаря"}
              </h2>
              <p className="font-manrope font-semibold text-[16px] leading-[150%] tracking-[-0.03em] text-black opacity-80">
                {t("about.description") ||
                  "Ми використовуємо сучасні, переважно малоінвазивні методи – від лазерної абляції й склеротерапії до стентування та шунтування, – завдяки яким пацієнти отримують ефективне лікування без тривалої госпіталізації. Усі рішення приймаються після детальної діагностики та спокійного пояснення можливих варіантів, з фокусом на безпеку, комфорт та довгостроковий результат."}
              </p>
            </section>

            {/* Education Section */}
            <section className="flex flex-col gap-6 md:gap-8 mt-10">
              <h2 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {t("about.education.title") || "Навчання"}
              </h2>
              <div className="flex flex-col gap-6 md:gap-8">
                {educationCourses.map((course) => (
                  <div key={course.id} className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#353556]/80">
                          {course.name}
                        </h3>
                        <p className="font-manrope font-semibold text-[14px] leading-[150%] tracking-[-0.03em] text-black opacity-50">
                          {course.location}
                        </p>
                      </div>
                      <button
                        className="px-6 py-[18px] rounded-full border-1 border-[#353556] font-inter font-medium text-[16px] leading-[120%] tracking-[-0.02em] text-[#353556] hover:bg-[#353556] hover:text-white transition-colors cursor-pointer w-full md:w-auto md:min-w-[150px]"
                        aria-label={`${course.certificate} - ${course.name}`}
                      >
                        {course.certificate}
                      </button>
                    </div>
                    <div className="w-full h-[1px] bg-[#353556] opacity-40"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
