"use client";

import { motion } from "framer-motion";
import { usePublicData } from "@/hooks/use-public-data";
import { Stat } from "@/types/public-api";

export function DynamicStatsSection() {
  const { data: stats, loading } = usePublicData<Stat[]>("/api/public/stats");

  if (loading) {
    return (
      <section className="bg-accent py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-12 w-24 animate-pulse rounded bg-accent-foreground/20" />
                <div className="mt-2 h-4 w-32 animate-pulse rounded bg-accent-foreground/20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="bg-accent py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl font-bold text-accent-foreground md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-accent-foreground/80 md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}