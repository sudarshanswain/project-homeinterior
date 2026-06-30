"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Homeowner, Mumbai",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
    rating: 5,
    text: "HomeInterior transformed our 3BHK into a luxurious masterpiece. The attention to detail and quality of work exceeded our expectations. Highly recommended!",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Business Owner, Delhi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    rating: 5,
    text: "Professional team with excellent project management. They delivered our office interior on time and within budget. The design has boosted our team's productivity.",
  },
  {
    id: 3,
    name: "Anita Patel",
    role: "Architect, Bangalore",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
    rating: 5,
    text: "As an architect, I have high standards. HomeInterior not only met but exceeded them. Their craftsmanship and material selection is truly premium.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Doctor, Pune",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
    rating: 5,
    text: "The modular kitchen they designed is perfect. Every inch is utilized efficiently. The team was responsive and accommodating throughout the project.",
  },
  {
    id: 5,
    name: "Meera Reddy",
    role: "Entrepreneur, Hyderabad",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
    rating: 5,
    text: "From consultation to final handover, the experience was seamless. They understood our vision perfectly and brought it to life beautifully.",
  },
  {
    id: 6,
    name: "Arjun Nair",
    role: "IT Professional, Chennai",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
    rating: 5,
    text: "The 3D visualization helped us visualize the final result before execution. The actual outcome was even better than what we saw in the renderings!",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
            Don&apos;t just take our word for it. Here&apos;s what our satisfied clients have to say about their experience with us.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
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
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}