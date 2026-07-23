"use client";

import { useState } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DESIGN_STYLES } from "@/lib/validations/lead";
import { SelectionCard } from "@/components/estimation/selection-card";
import type { EstimationFormValues } from "@/types/estimation-form";

interface StepDesignProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export function StepDesign({ form, onNext, onBack }: StepDesignProps) {
  const [urlText, setUrlText] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log("=== Step 5 (Design) Debug ===");
    console.log("Selected Design Style:", form.getValues("design.designStyle"));
    console.log("Full design object:", form.getValues("design"));
    console.log("=== Calling onNext ===\n");
    
    // Just call onNext - parent will handle validation
    onNext();
  };

  const handleUrlChange = (value: string) => {
    setUrlText(value);
    // Split by newlines, filter out empty lines, and validate URLs
    const urls = value.split('\n')
      .map(url => url.trim())
      .filter(url => url !== '')
      .filter(url => {
        // Basic URL validation - must start with http:// or https://
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      });
    
    form.setValue("design.inspirationUrls", urls, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Design Preference
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose a design style that matches your taste and vision.
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Select Design Style <span className="text-destructive">*</span>
            </Label>
            
            {/* Use Controller to manage the entire design object */}
            <Controller
              name="design"
              control={form.control}
              render={({ field }) => {
                const currentDesign = field.value || { designStyle: "", inspirationUrls: [] };
                const selectedStyle = currentDesign.designStyle || "";
                
                const handleStyleSelect = (styleValue: string) => {
                  console.log(`Selected design style: ${styleValue}`);
                  
                  // Update the entire design object
                  const updatedDesign = {
                    ...currentDesign,
                    designStyle: styleValue,
                  };
                  
                  field.onChange(updatedDesign);
                  console.log("Form values after selection:", form.getValues("design"));
                };
                
                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {DESIGN_STYLES.map((style) => (
                      <SelectionCard
                        key={style.value}
                        selected={selectedStyle === style.value}
                        onSelect={() => handleStyleSelect(style.value)}
                      >
                        <div className="font-semibold text-center text-base">{style.label}</div>
                      </SelectionCard>
                    ))}
                  </div>
                );
              }}
            />
            
            {form.formState.errors.design && (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.design?.message || "")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspirationUrls" className="text-base font-semibold">
              Inspiration Images (Optional)
            </Label>
            <p className="text-sm text-muted-foreground">
              Add URLs to inspiration images (max 10)
            </p>
            <textarea
              id="inspirationUrls"
              value={urlText}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste image URLs here, one per line&#10;Example:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="flex min-h-[120px] w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.design?.inspirationUrls && (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.design.inspirationUrls?.message || "")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}