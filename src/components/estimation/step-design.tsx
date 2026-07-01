"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { designPreferenceSchema, DesignPreferenceInput, DESIGN_STYLES } from "@/lib/validations/lead";

interface StepDesignProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
}

export function StepDesign({ form, onNext, onBack }: StepDesignProps) {
  const selectedStyle = form.watch("design.designStyle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {DESIGN_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => form.setValue("design.designStyle", style.value)}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-center
                    ${selectedStyle === style.value
                      ? "border-accent bg-accent/10 shadow-lg scale-105"
                      : "border-border hover:border-accent/50 hover:shadow-md"
                    }
                  `}
                >
                  <div className="font-semibold text-base">{style.label}</div>
                </button>
              ))}
            </div>
            {form.formState.errors.design && (
              <p className="text-sm text-destructive">
                {String((form.formState.errors as any).design?.message || "")}
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
              {...form.register("design.inspirationUrls.0")}
              placeholder="Paste image URLs here, one per line"
              className="flex min-h-[120px] w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}