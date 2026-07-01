import { DynamicNavbar } from "@/components/dynamic-navbar";
import { DynamicServicesSection } from "@/components/dynamic-services-section";
import { DynamicFooter } from "@/components/dynamic-footer";

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DynamicNavbar />
      <main className="flex-1">
        <DynamicServicesSection />
      </main>
      <DynamicFooter />
    </div>
  );
}