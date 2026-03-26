"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export interface ServiceItem {
  slug: string;
  category: string;
  categoryKey?: string;
  title: string;
  description: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  showDivider?: boolean;
}

export default function ServiceCard({
  service,
  showDivider = false,
}: ServiceCardProps) {
  const { t } = useTranslation();
  const { lang } = useParams();
  return (
    <div className="relative">
      <div className="relative flex flex-col lg:flex-row items-start gap-6 lg:gap-8 py-6 lg:py-8">
        {/* Service Content */}
        <div className="flex-1 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 lg:gap-6">
          <div className="flex-1 flex flex-col gap-4 lg:gap-6 md:max-w-[60%]">
            {/* Service Title */}
            <h4 className="font-manrope font-bold text-[32px] md:text-[36px] lg:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556] flex items-end">
              {service.title}
            </h4>

            {/* Description */}
            <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
              {service.description}
            </p>
          </div>

          {/* Button */}
          <Link href={`/${lang}/services/${service.slug}`} className="w-full md:w-auto">
            <Button
              className="w-full md:w-[174px] h-[66px] min-h-[54px] rounded-[50px] font-inter font-medium text-base leading-[100%] tracking-[-0.01em] text-white"
              style={{
                background:
                  "radial-gradient(114.39% 151.52% at 50% 151.52%, #000000 0%, #3A3A45 100%)",
              }}
            >
              {t("packages.buttonMore")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Divider - between services */}
      {showDivider && (
        <div className="h-[1px] w-full bg-[#1B1661] opacity-40 my-2 lg:my-4" />
      )}
    </div>
  );
}
