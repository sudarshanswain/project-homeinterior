"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SelectionCard({
  selected,
  onSelect,
  children,
  disabled = false,
}: SelectionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!disabled) {
        onSelect();
      }
    }
  };

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-4 md:p-6 rounded-xl border-2 transition-all duration-200",
        "cursor-pointer text-left",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        selected
          ? "border-[#f59e0b] bg-[#f59e0b] text-white shadow-[0_8px_20px_rgba(245,158,11,0.25)] scale-[1.02] font-semibold"
          : "border-slate-300 bg-white text-slate-900 hover:border-[#f59e0b] hover:shadow-md"
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <Check className="w-4 h-4 text-[#f59e0b]" strokeWidth={3} />
        </motion.div>
      )}
      <div className={cn("transition-colors duration-200", selected && "text-white font-semibold")}>
        {children}
      </div>
    </motion.button>
  );
}

interface ToggleChipProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}

export function ToggleChip({ enabled, onToggle, label }: ToggleChipProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.button
      type="button"
      role="button"
      aria-pressed={enabled}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative p-3 md:p-4 rounded-lg border-2 transition-all duration-200",
        "cursor-pointer text-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        enabled
          ? "border-[#f59e0b] bg-[#f59e0b] text-white shadow-[0_8px_20px_rgba(245,158,11,0.25)]"
          : "border-slate-300 bg-white text-slate-900 hover:border-[#f59e0b] hover:shadow-md"
      )}
    >
      {enabled && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}
      <div className="flex flex-col items-center gap-1">
        <span className={cn("text-sm font-medium transition-colors duration-200", enabled && "text-white font-semibold")}>
          {label}
        </span>
        <span
          className={cn(
            "text-xs font-bold transition-colors duration-200",
            enabled ? "text-white" : "text-slate-600"
          )}
        >
          {enabled ? "Yes" : "No"}
        </span>
      </div>
    </motion.button>
  );
}