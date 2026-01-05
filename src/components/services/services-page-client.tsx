"use client";

import ServicesList from "@/components/services/services-list";
import { ServiceItem } from "@/components/services/service-card";
import { ServiceData, ServiceCategory } from "@/strapi/services";

interface ServicesPageClientProps {
  servicesData: ServiceData[];
}

const categoryLabels: Record<ServiceCategory, string> = {
  surgical: "Пластична хірургія",
  phlebology: "Флебологія",
  cosmetology: "Ін'єкційна косметологія",
};

const serviceCategories: ServiceCategory[] = [
  "surgical",
  "phlebology",
  "cosmetology",
];

export default function ServicesPageClient({
    servicesData: initialServices,
}: ServicesPageClientProps) {
  // Мапимо дані до формату ServiceItem
  const services: ServiceItem[] = initialServices.map((service) => {
    return {
      slug: service.slug,
      category: categoryLabels[service.category] || "Пластична хірургія",
      categoryKey: service.category,
      title: service.title,
      description: service.description,
      image: service.image,
    };
  });

  // Групуємо послуги за категоріями
  const groupedServices = serviceCategories.map((cat) => ({
    category: categoryLabels[cat],
    categoryKey: cat,
    services: services.filter((s) => s.categoryKey === cat),
  }));

  return (
    <>
      <ServicesList groupedServices={groupedServices} />
    </>
  );
}
