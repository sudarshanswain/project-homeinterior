"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Clock, Shield, Sparkles, Users, DollarSign } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Award-Winning Designs",
    description:
      "Recognized nationally for excellence in interior design with 15+ industry awards and counting.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "We respect your time. Our projects are delivered on schedule with 98% on-time completion rate.",
  },
  {
    icon: Shield,
    title: "5-Year Warranty",
    description:
      "Complete peace of mind with comprehensive warranty on all materials and workmanship.",
  },
  {
    icon: Sparkles,
    title: "Premium Materials",
    description:
      "We source only the finest materials from trusted suppliers to ensure lasting quality and elegance.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "50+ certified designers and architects with years of experience in luxury interior projects.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "No hidden costs. Get detailed quotes upfront with flexible payment plans to suit your budget.",
  },
];

export function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-xl"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}