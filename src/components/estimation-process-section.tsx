"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, Users, ClipboardList, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Share Your Details",
    description: "Fill in your contact information and property details in our simple form.",
    icon: Users,
  },
  {
    number: "02",
    title: "Describe Your Needs",
    description: "Tell us about your rooms, services required, and design preferences.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Set Your Budget",
    description: "Choose your budget range and upload any reference images or floor plans.",
    icon: Calculator,
  },
  {
    number: "04",
    title: "Review & Submit",
    description: "Review all details, make any changes, and submit your request.",
    icon: FileText,
  },
  {
    number: "05",
    title: "Get Your Estimate",
    description: "Our team will contact you within 24 hours with a detailed quotation.",
    icon: CheckCircle,
  },
];

export function EstimationProcessSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-wider text-accent uppercase mb-4">
            How It Works
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Get Your Free Estimate in 5 Easy Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            Our streamlined process makes it easy to get a detailed estimate for your interior design project.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Icon Circle */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground mb-4 mx-auto relative z-10">
                    <step.icon className="h-8 w-8" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center text-xs font-bold text-accent">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href="/estimation"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition-all hover:scale-105 hover:shadow-xl"
          >
            Start Your Free Estimate
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            No obligation • Free consultation • Response within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}