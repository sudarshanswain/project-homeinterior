"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Palette, Hammer, CheckCircle } from "lucide-react";

const processSteps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Consultation",
    description:
      "We begin with an in-depth discussion to understand your vision, requirements, and budget for the perfect interior design.",
  },
  {
    icon: Palette,
    number: "02",
    title: "Design & Planning",
    description:
      "Our expert designers create detailed 3D visualizations and floor plans tailored to your space and preferences.",
  },
  {
    icon: Hammer,
    number: "03",
    title: "Execution",
    description:
      "We manage the entire execution process with premium materials, skilled craftsmen, and strict quality control.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Handover",
    description:
      "Final inspection, styling, and handover of your dream space with complete documentation and warranty.",
  },
];

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
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
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-accent">
                          Step {step.number}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}