"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { EstimationFormValues } from "@/types/estimation-form";

interface StepPropertyProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
  onBack: () => void;
}

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment", icon: "🏢" },
  { value: "VILLA", label: "Villa", icon: "🏡" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House", icon: "🏠" },
  { value: "COMMERCIAL", label: "Commercial", icon: "🏪" },
  { value: "OFFICE", label: "Office", icon: "🏢" },
  { value: "RETAIL", label: "Retail", icon: "🛍️" },
  { value: "RESTAURANT", label: "Restaurant", icon: "🍽️" },
  { value: "HOTEL", label: "Hotel", icon: "🏨" },
];

const CONFIGURATIONS = [
  "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Villa", "Custom"
];

const PROPERTY_STATUSES = [
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "RENOVATION", label: "Renovation" },
];

export function StepProperty({ form, onNext, onBack }: StepPropertyProps) {
  const errors = form.formState.errors;
  const propertyType = form.watch("property.propertyType");
  const configuration = form.watch("property.configuration");
  const status = form.watch("property.status");
  const totalArea = form.watch("property.totalArea") || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Property Details
        </h2>
        <p className="text-muted-foreground text-lg">
          Tell us about your property to provide accurate estimation.
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 space-y-8">
          {/* Property Type */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Property Type <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PROPERTY_TYPES.map((type) => {
                const isSelected = propertyType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => form.setValue("property.propertyType", type.value as "APARTMENT" | "VILLA" | "INDEPENDENT_HOUSE" | "COMMERCIAL" | "OFFICE" | "RETAIL" | "RESTAURANT" | "HOTEL")}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:border-amber-500 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                );
              })}
            </div>
            {errors.property?.propertyType && (
              <p className="text-sm text-destructive">
                {String(errors.property.propertyType.message || 'Please select a property type')}
              </p>
            )}
          </div>

          {/* Configuration - Radio buttons with gold highlight */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Configuration <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {CONFIGURATIONS.map((config) => {
                const isSelected = form.watch("property.configuration") === config;
                return (
                  <button
                    key={config}
                    type="button"
                    onClick={() => form.setValue("property.configuration", config)}
                    className={`relative py-3 px-4 rounded-lg border-2 transition-all hover:border-amber-500 font-medium ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    {config}
                  </button>
                );
              })}
            </div>
            {errors.property?.configuration && (
              <p className="text-sm text-destructive">
                {String(errors.property.configuration.message || 'Please select a configuration')}
              </p>
            )}
          </div>

          {/* Total Area */}
          <div className="space-y-4">
            <Label htmlFor="property.totalArea" className="text-base font-semibold">
              Total Area (Sq Ft) <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-4 items-center">
              <Input
                id="property.totalArea"
                type="number"
                {...form.register("property.totalArea", { valueAsNumber: true })}
                placeholder="1200"
                className={`h-12 text-lg ${errors.property?.totalArea ? "border-destructive" : ""}`}
              />
              <span className="text-lg font-medium text-muted-foreground">sq ft</span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={totalArea}
              onChange={(e) => form.setValue("property.totalArea", parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>200 sq ft</span>
              <span>10,000 sq ft</span>
            </div>
            {errors.property?.totalArea && (
              <p className="text-sm text-destructive">
                {String(errors.property.totalArea.message || 'Please enter total area')}
              </p>
            )}
          </div>

          {/* Property Status */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Property Status <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROPERTY_STATUSES.map((s) => {
                const isSelected = form.watch("property.status") === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => form.setValue("property.status", s.value as "READY_TO_MOVE" | "UNDER_CONSTRUCTION" | "RENOVATION")}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:border-amber-500 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="text-base font-medium">{s.label}</div>
                  </button>
                );
              })}
            </div>
            {errors.property?.status && (
              <p className="text-sm text-destructive">
                {String(errors.property.status.message || 'Please select property status')}
              </p>
            )}
          </div>

          {/* Expected Possession */}
          <div className="space-y-2">
            <Label htmlFor="property.expectedPossession" className="text-base font-semibold">
              Expected Possession Date
            </Label>
            <Input
              id="property.expectedPossession"
              type="date"
              {...form.register("property.expectedPossession")}
              className="h-12"
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}