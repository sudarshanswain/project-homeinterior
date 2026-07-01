"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export function CtaSection() {
  return (
    <section id="contact" className="scroll-offset relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--accent)_0%,_transparent_50%)] opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="inline-block text-sm font-semibold tracking-wider text-accent uppercase">
              Get In Touch
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Let&apos;s discuss your dream project. Our expert designers are ready to bring your vision to life with premium quality and exceptional service.
            </p>

            {/* Contact Info */}
            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Call Us</p>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="mt-1 block text-lg font-semibold text-foreground hover:text-accent"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Us</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-1 block text-lg font-semibold text-foreground hover:text-accent"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-2xl sm:p-10">
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Book a Free Consultation
              </h3>
              <p className="mt-3 text-muted-foreground">
                Schedule a complimentary design consultation with our experts. We&apos;ll discuss your requirements and provide personalized recommendations.
              </p>

              {/* Benefits List */}
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="h-3 w-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">Free 3D Design Visualization</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="h-3 w-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">No Obligation Quote</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="h-3 w-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">Expert Design Consultation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="h-3 w-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">Flexible Scheduling</span>
                </li>
              </ul>

               {/* CTA Buttons */}
               <div className="mt-8 space-y-4">
                 <Link
                   href="/estimation"
                   className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition-all hover:scale-105 hover:shadow-xl"
                 >
                   Get Free Estimate
                   <ArrowRight className="h-5 w-5" />
                 </Link>
                 <Link
                   href={`https://wa.me/${siteConfig.whatsapp}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-accent px-8 py-4 text-base font-semibold text-accent transition-all hover:bg-accent hover:text-accent-foreground"
                 >
                   Book via WhatsApp
                 </Link>
               </div>

              {/* Trust Badge */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Trusted by 2,500+ happy customers across India
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}