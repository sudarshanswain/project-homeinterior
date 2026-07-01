import { DynamicNavbar } from "@/components/dynamic-navbar";
import { DynamicPortfolioSection } from "@/components/dynamic-portfolio-section";
import { DynamicFooter } from "@/components/dynamic-footer";

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DynamicNavbar />
      <main className="flex-1">
        <DynamicPortfolioSection />
      </main>
      <DynamicFooter />
    </div>
  );
}