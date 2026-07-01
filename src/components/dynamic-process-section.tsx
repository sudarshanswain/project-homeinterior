"use client";

import { motion } from "framer-motion";
import { usePublicData } from "@/hooks/use-public-data";
import { ProcessStep } from "@/types/public-api";
import { MessageSquare, Palette, Hammer, CheckCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "message-square": MessageSquare,
  palette: Palette,
  hammer: Hammer,
  "check-circle": CheckCircle,
};

export function DynamicProcessSection() {
  const { data: steps, loading } = usePublicData<ProcessStep[]>("/api/public/process");

  console.log("process", { steps, loading });

  if (loading) {
    return (
      <section id="process" className="scroll-offset py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="h-6 w-32 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-12 w-96 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex-1 rounded-2xl border border-border bg-card p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted mb-2" />
                      <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!steps || steps.length === 0) {
    console.log("process: no steps");
    return null;
  }

  console.log("process: rendering", steps.length, "steps");
  return (
    <section id="process" className="scroll-offset py-24 bg-muted/30">
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
            Our Process
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            How We Bring Your Vision to Life
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A seamless four-step process that ensures transparency, quality, and timely delivery of your dream interior.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="mt-20 relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:left-1/2" />

          {/* Process Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon || "message-square"] || MessageSquare;
              return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col gap-8 md:flex-row md:items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-16" : "md:text-left md:pl-16"}`}>
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
                      <div className={`flex items-center gap-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-accent">
                            Step {step.stepNumber}
                          </span>
                          <h3 className="font-serif text-xl font-semibold text-foreground">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-8 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-accent bg-background md:left-1/2" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}