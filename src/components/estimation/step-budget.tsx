"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BUDGET_RANGE_OPTIONS } from "@/lib/validations/lead";
import type { EstimationFormValues } from "@/types/estimation-form";

interface StepBudgetProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export function StepBudget({ form, onNext }: StepBudgetProps) {
  const selectedRange = form.watch("budget.budgetRange");
  const customBudget = form.watch("budget.budgetCustom");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const errors = form.formState.errors;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Budget Range
        </h2>
        <p className="text-muted-foreground text-lg">
          Help us understand your budget range for the project.
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Select Budget Range <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUDGET_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => form.setValue("budget.budgetRange", option.value as "UNDER_5_LAKHS" | "5_10_LAKHS" | "10_20_LAKHS" | "20_40_LAKHS" | "40_LAKHS_PLUS" | "CUSTOM")}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left
                    ${selectedRange === option.value
                      ? "border-accent bg-accent/10 shadow-lg scale-105"
                      : "border-border hover:border-accent/50 hover:shadow-md"
                    }
                  `}
                >
                  <div className="font-semibold text-base">{option.label}</div>
                </button>
              ))}
            </div>
            {errors.budget && (
              <p className="text-sm text-destructive">
                {String(errors.budget.message || "")}
              </p>
            )}
          </div>

          {selectedRange === "CUSTOM" && (
            <div className="space-y-2">
              <Label htmlFor="budgetCustom" className="text-base font-semibold">
                Custom Budget (INR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="budgetCustom"
                type="number"
                {...form.register("budget.budgetCustom", { valueAsNumber: true })}
                placeholder="Enter your budget in INR"
                min="0"
                step="1000"
                className="h-12"
              />
              {errors.budget && (
                <p className="text-sm text-destructive">
                  {String((errors.budget as { budgetCustom?: { message?: string } })?.budgetCustom?.message || "")}
                </p>
              )}
              {customBudget && customBudget > 0 && (
                <p className="text-sm text-muted-foreground">
                  Your budget: ₹{customBudget.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}