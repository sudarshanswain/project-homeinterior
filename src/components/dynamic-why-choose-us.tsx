"use client";

import { motion } from "framer-motion";
import { usePublicData } from "@/hooks/use-public-data";
import { Feature } from "@/types/public-api";
import { Award, Clock, Shield, Sparkles, Users, DollarSign } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  clock: Clock,
  shield: Shield,
  sparkles: Sparkles,
  users: Users,
  "dollar-sign": DollarSign,
};

export function DynamicWhyChooseUs() {
  const { data: features, loading } = usePublicData<Feature[]>("/api/public/features");

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-6 w-32 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-12 w-96 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-8">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-muted mb-6" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background">
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
            Why Choose Us
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            The HomeInterior Difference
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We combine creativity, expertise, and premium service to deliver interiors that exceed expectations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon || "award"] || Award;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}