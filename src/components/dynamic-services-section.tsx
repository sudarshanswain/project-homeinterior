"use client";

import { motion } from "framer-motion";
import { usePublicData } from "@/hooks/use-public-data";
import { Service } from "@/types/public-api";
import { ServiceCardSkeleton } from "@/components/ui/skeleton";
import { Sofa, Building2, ChefHat, Shirt, Ruler, Lamp } from "lucide-react";
import type { ElementType } from "react";

const iconMap: Record<string, ElementType> = {
  sofa: Sofa,
  "building-2": Building2,
  "chef-hat": ChefHat,
  shirt: Shirt,
  ruler: Ruler,
  lamp: Lamp,
};

export function DynamicServicesSection() {
  const { data: services, loading } = usePublicData<Service[]>("/api/public/services");

  console.log("services", { services, loading });

  if (loading) {
    return (
      <section id="services" className="scroll-offset py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-6 w-32 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-12 w-96 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    console.log("services: no services");
    return null;
  }

  console.log("services: rendering", services.length, "services");
  return (
    <section id="services" className="scroll-offset py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-sm font-semibold tracking-wider text-accent uppercase">
            What We Offer
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Premium Interior Design Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From concept to completion, we deliver end-to-end interior design solutions that transform your space into a masterpiece.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || "sofa"] || Sofa;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Learn More
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}