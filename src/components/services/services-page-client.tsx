"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ServicesList from "@/components/services/services-list";
import { ServiceItem } from "@/components/services/service-card";
import { ServiceData, ServiceCategory } from "@/strapi/services";
import { useLenis } from "@/components/providers/lenis-context";

interface ServicesPageClientProps {
  servicesData: ServiceData[];
}

const serviceCategories: ServiceCategory[] = [
  "surgical",
  "phlebology",
  "cosmetology",
];

export default function ServicesPageClient({
    servicesData: initialServices,
}: ServicesPageClientProps) {
  const { lenis } = useLenis();
  const { t } = useTranslation();

  const categoryLabels: Record<ServiceCategory, string> = {
    surgical: t("services.categories.surgical"),
    phlebology: t("services.categories.phlebology"),
    cosmetology: t("services.categories.cosmetology"),
  };

  // Мапимо дані до формату ServiceItem
  const services: ServiceItem[] = initialServices.map((service) => {
    return {
      slug: service.slug,
      category: categoryLabels[service.category] || categoryLabels.surgical,
      categoryKey: service.category,
      title: service.title,
      description: service.description,
    };
  });

  // Групуємо послуги за категоріями
  const groupedServices = serviceCategories.map((cat) => ({
    category: categoryLabels[cat],
    categoryKey: cat,
    services: services.filter((s) => s.categoryKey === cat),
  }));

  // Scroll to anchor after page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for DOM to be ready
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const offset = 120; // Match the offset from smooth-scroll-provider
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;

          // Use smooth scroll if Lenis is available, otherwise use native scroll
          if (lenis) {
            lenis.scrollTo(offsetPosition, {
              duration: 1.2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else {
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [lenis]);

  return (
    <>
      <ServicesList groupedServices={groupedServices} />
    </>
  );
}
