"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sofa, Lamp, ChefHat, Shirt, Ruler, Building2 } from "lucide-react";

const services = [
  {
    icon: Sofa,
    title: "Residential Design",
    description:
      "Complete home interior design tailored to your lifestyle, from modern apartments to luxury villas.",
  },
  {
    icon: Building2,
    title: "Commercial Spaces",
    description:
      "Professional office and commercial interior design that enhances productivity and brand image.",
  },
  {
    icon: ChefHat,
    title: "Modular Kitchens",
    description:
      "Smart, space-efficient modular kitchen designs with premium finishes and innovative storage solutions.",
  },
  {
    icon: Shirt,
    title: "Wardrobe Design",
    description:
      "Custom walk-in wardrobes and built-in wardrobes designed for maximum organization and elegance.",
  },
  {
    icon: Ruler,
    title: "Space Planning",
    description:
      "Optimize your space with expert planning that maximizes functionality without compromising aesthetics.",
  },
  {
    icon: Lamp,
    title: "Lighting Design",
    description:
      "Ambient, task, and accent lighting solutions that create the perfect mood for every room.",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-xl"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon className="h-7 w-7" />
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}