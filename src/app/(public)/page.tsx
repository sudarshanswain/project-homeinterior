import { DynamicNavbar } from "@/components/dynamic-navbar";
import { DynamicHeroSection } from "@/components/dynamic-hero-section";
import { DynamicStatsSection } from "@/components/dynamic-stats-section";
import { DynamicServicesSection } from "@/components/dynamic-services-section";
import { DynamicProcessSection } from "@/components/dynamic-process-section";
import { DynamicWhyChooseUs } from "@/components/dynamic-why-choose-us";
import { DynamicPortfolioSection } from "@/components/dynamic-portfolio-section";
import { DynamicTestimonialsSection } from "@/components/dynamic-testimonials-section";
import { DynamicFaqSection } from "@/components/dynamic-faq-section";
import { EstimationProcessSection } from "@/components/estimation-process-section";
import { CtaSection } from "@/components/cta-section";
import { DynamicFooter } from "@/components/dynamic-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DynamicNavbar />
      <main className="flex-1">
        <DynamicHeroSection />
        <DynamicStatsSection />
        <DynamicServicesSection />
        <DynamicProcessSection />
        <DynamicWhyChooseUs />
        <DynamicPortfolioSection />
        <DynamicTestimonialsSection />
        <DynamicFaqSection />
        <EstimationProcessSection />
        <CtaSection />
      </main>
      <DynamicFooter />
    </div>
  );
}
