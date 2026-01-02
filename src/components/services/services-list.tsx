import ServiceCard, { ServiceItem } from "./service-card";

interface GroupedService {
  category: string;
  categoryKey: string;
  services: ServiceItem[];
}

interface ServicesListProps {
  groupedServices: GroupedService[];
}

export default function ServicesList({ groupedServices }: ServicesListProps) {
  return (
    <div className="space-y-0">
      {groupedServices.map((group, groupIndex) => (
        <div key={group.categoryKey}>
          <section
            id={`category-${group.categoryKey}`}
            className="relative grid grid-cols-1 lg:grid-cols-2 gap-0"
          >
            {/* Left Column - Sticky Category Title (only for this section) */}
            <div className="hidden lg:block">
              <div className="lg:sticky lg:top-[100px]">
                <h3 className="font-manrope font-bold text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556] max-w-[70%]">
                  {group.category}
                </h3>
              </div>
            </div>

            {/* Right Column - Services for this category */}
            <div className="">
              {/* Mobile Category Title */}
              <div className="lg:hidden py-6">
                <h3 className="font-manrope font-bold text-[60px] md:text-[80px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {group.category}
                </h3>
              </div>

              <div className="space-y-0">
                {group.services.map((service, serviceIndex) => (
                  <div key={service.slug}>
                    <ServiceCard
                      service={service}
                      showDivider={serviceIndex < group.services.length - 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Category divider - full width between categories */}
          {groupIndex < groupedServices.length - 1 && (
            <div className="h-[1px] w-full bg-[#1B1661] opacity-40 my-8 lg:my-12" />
          )}
        </div>
      ))}
    </div>
  );
}
