"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePublicData } from "@/hooks/use-public-data";
import { Testimonial } from "@/types/public-api";
import { Star, Quote } from "lucide-react";
import { TestimonialCardSkeleton } from "@/components/ui/skeleton";

export function DynamicTestimonialsSection() {
  const { data: testimonials, loading } = usePublicData<Testimonial[]>("/api/public/testimonials");

  console.log("testimonials", { testimonials, loading });

  if (loading) {
    return (
      <section id="testimonials" className="scroll-offset py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-6 w-32 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-12 w-96 animate-pulse rounded bg-muted mx-auto mb-4" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TestimonialCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    console.log("testimonials: no testimonials");
    return null;
  }

  console.log("testimonials: rendering", testimonials.length, "testimonials");
  return (
    <section id="testimonials" className="scroll-offset py-24 bg-background">
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
            Testimonials
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {`Don't just take our word for it. Here's what our satisfied clients have to say about their experience with us.`}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-accent/50 hover:shadow-xl"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-accent/20">
                <Quote className="h-12 w-12" />
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="mt-4 text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  {testimonial.photoUrl ? (
                    <Image
                      src={testimonial.photoUrl}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-xs text-muted-foreground">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  {testimonial.location && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}