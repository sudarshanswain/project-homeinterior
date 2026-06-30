"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the typical timeline for a home interior project?",
    answer:
      "The timeline varies based on the scope of the project. A standard 3BHK home interior typically takes 3-4 months from design to handover. This includes 2-3 weeks for design and planning, followed by execution and installation. We provide a detailed timeline during the consultation phase.",
  },
  {
    question: "Do you provide 3D visualization before execution?",
    answer:
      "Yes, we provide detailed 3D renderings and walkthrough videos of your space before execution begins. This helps you visualize the final result and make any necessary adjustments. We believe in complete transparency and want you to be 100% satisfied before we proceed.",
  },
  {
    question: "What are your payment terms?",
    answer:
      "We offer flexible payment plans to suit your budget. Typically, we follow a milestone-based payment structure: 30% advance to start the project, 30% after material procurement, 30% during execution, and 10% upon final handover. We also offer EMI options through leading banks.",
  },
  {
    question: "Do you provide warranty on your work?",
    answer:
      "Yes, we provide a comprehensive 5-year warranty on all our workmanship and materials. This covers any manufacturing defects, workmanship issues, or material failures. Our warranty ensures complete peace of mind for your investment.",
  },
  {
    question: "Can you work with my existing furniture and decor?",
    answer:
      "Absolutely! We believe in creating spaces that reflect your personality. Our designers can incorporate your existing furniture and decor pieces into the new design, ensuring a cohesive and personalized look that saves you money while achieving the desired aesthetic.",
  },
  {
    question: "Do you handle all permits and approvals?",
    answer:
      "Yes, we take care of all necessary permits, approvals, and regulatory compliance required for interior work. Our team manages the entire documentation process, ensuring a smooth and hassle-free experience for you.",
  },
];

export function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-sm font-semibold tracking-wider text-accent uppercase">
            FAQ
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about our interior design services, process, and policies.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-accent/50"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="pr-4 font-serif text-lg font-semibold text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 flex-shrink-0 text-accent transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}