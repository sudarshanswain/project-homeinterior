"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { usePublicData } from "@/hooks/use-public-data";
import { HeroSection } from "@/types/public-api";

export function DynamicHeroSection() {
  const { data: hero, loading } = usePublicData<HeroSection>("/api/public/hero");

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-muted">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl space-y-6">
            <div className="h-24 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-16 w-full animate-pulse rounded bg-muted" />
            <div className="h-20 w-5/6 animate-pulse rounded bg-muted" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-48 animate-pulse rounded-full bg-muted" />
              <div className="h-12 w-48 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      {hero.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${hero.backgroundImage}')`,
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75"
            style={{ opacity: Math.max(0.55, Math.min(0.65, hero.overlayOpacity / 100)) }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          {hero.badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm font-medium text-white">
                {hero.badge}
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {hero.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href={hero.primaryCtaLink}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition-all hover:scale-105 hover:shadow-2xl"
            >
              {hero.primaryCtaText}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            {hero.secondaryCtaText && hero.secondaryCtaLink && (
              <button className="inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Play className="h-5 w-5 fill-white" />
                </span>
                {hero.secondaryCtaText}
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-white/80">
            Scroll Down
          </span>
          <div className="h-8 w-5 rounded-full border-2 border-white/50">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white mx-auto" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}