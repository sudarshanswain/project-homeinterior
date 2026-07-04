"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AVAILABLE_SERVICES } from "@/lib/validations/lead";
import type { EstimationFormValues } from "@/types/estimation-form";

interface StepServicesProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
}

export function StepServices({ form, onNext }: StepServicesProps) {
  const selectedServices = form.watch("services.services") || [];

  const toggleService = (service: string) => {
    const current = form.getValues("services.services") || [];
    if (current.includes(service)) {
      form.setValue(
        "services.services",
        current.filter((s: string) => s !== service)
      );
    } else {
      form.setValue("services.services", [...current, service]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Services Required
        </h2>
        <p className="text-muted-foreground text-lg">
          Select all the services you need for your interior project.
        </p>
      </div>

      <Card>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service);
              return (
                <div
                  key={service}
                  className={`
                    flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                    ${isSelected
                      ? "border-accent bg-accent/10 shadow-md"
                      : "border-border hover:border-accent/50"
                    }
                  `}
                  onClick={() => toggleService(service)}
                >
                  <Checkbox
                    id={service}
                    checked={isSelected}
                    onCheckedChange={() => toggleService(service)}
                  />
                  <Label
                    htmlFor={service}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {service}
                  </Label>
                </div>
              );
            })}
          </div>

          {form.formState.errors.services && (
            <p className="text-sm text-destructive mt-4">
              {String(form.formState.errors.services?.message || "")}
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
}