"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PROPERTY_TYPES, PROPERTY_STATUSES, DESIGN_STYLES } from "@/lib/validations/lead";
import type { EstimationFormValues } from "@/types/estimation-form";

interface StepReviewProps {
  form: UseFormReturn<EstimationFormValues>;
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function StepReview({ form, onNext, onBack, onEdit }: StepReviewProps) {
  const data = form.getValues();
  const customer = data.customer;
  const property = data.property;
  const rooms = data.rooms?.rooms || [];
  const services = data.services?.services || [];
  const design = data.design;
  const budget = data.budget;
  const attachments = data.attachments?.files || [];

  const getPropertyTypeLabel = (value: string) => {
    return PROPERTY_TYPES.find((t) => t.value === value)?.label || value;
  };

  const getPropertyStatusLabel = (value: string) => {
    return PROPERTY_STATUSES.find((s) => s.value === value)?.label || value;
  };

  const getDesignStyleLabel = (value: string) => {
    return DESIGN_STYLES.find((s) => s.value === value)?.label || value;
  };

  const getBudgetLabel = (value: string) => {
    const option = [
      { value: "UNDER_5_LAKHS", label: "Under 5 Lakhs" },
      { value: "5_10_LAKHS", label: "5 – 10 Lakhs" },
      { value: "10_20_LAKHS", label: "10 – 20 Lakhs" },
      { value: "20_40_LAKHS", label: "20 – 40 Lakhs" },
      { value: "40_LAKHS_PLUS", label: "40 Lakhs+" },
      { value: "CUSTOM", label: "Custom Budget" },
    ].find((b) => b.value === value);
    return option?.label || value;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Review & Submit
        </h2>
        <p className="text-muted-foreground text-lg">
          Please review all the information before submitting your request.
        </p>
      </div>

      <div className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Customer Information
              </h3>
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => onEdit(0)}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="text-foreground font-medium text-base">{customer.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="text-foreground font-medium text-base">{customer.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-foreground font-medium text-base">{customer.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">WhatsApp</Label>
                <p className="text-foreground font-medium text-base">{customer.whatsapp || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">City</Label>
                <p className="text-foreground font-medium text-base">{customer.city}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">State</Label>
                <p className="text-foreground font-medium text-base">{customer.state}</p>
              </div>
              {customer.preferredTime && (
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Preferred Contact Time</Label>
                  <p className="text-foreground font-medium text-base">{customer.preferredTime}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Property Details
              </h3>
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => onEdit(1)}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Property Type</Label>
                <p className="text-foreground font-medium text-base">
                  {getPropertyTypeLabel(property.propertyType)}
                </p>
              </div>
              {property.configuration && (
                <div>
                  <Label className="text-muted-foreground">Configuration</Label>
                  <p className="text-foreground font-medium text-base">{property.configuration}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Total Area</Label>
                <p className="text-foreground font-medium text-base">{property.totalArea} sq ft</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Property Status</Label>
                <p className="text-foreground font-medium text-base">
                  {getPropertyStatusLabel(property.status)}
                </p>
              </div>
              {property.expectedPossession && (
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Expected Possession Date</Label>
                  <p className="text-foreground font-medium text-base">{property.expectedPossession}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rooms */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Rooms ({rooms.length})
              </h3>
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => onEdit(2)}
              >
                Edit
              </button>
            </div>
            <div className="space-y-3">
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-border bg-muted/50"
                >
                  <p className="font-medium text-foreground text-base">{room.roomName}</p>
                  <p className="text-sm text-muted-foreground">
                    {room.length && room.width
                      ? `${room.length}ft × ${room.width}ft`
                      : "Dimensions not specified"}
                    {room.area && ` • ${room.area} sq ft`}
                  </p>
                  {(room.wardrobeNeeded || room.falseCeiling || room.lighting || room.painting || room.flooring) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.wardrobeNeeded && (
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          Wardrobe
                        </span>
                      )}
                      {room.falseCeiling && (
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          False Ceiling
                        </span>
                      )}
                      {room.lighting && (
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          Lighting
                        </span>
                      )}
                      {room.painting && (
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          Painting
                        </span>
                      )}
                      {room.flooring && (
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          Flooring
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Services Required ({services.length})
              </h3>
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => onEdit(3)}
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <span
                  key={service}
                  className="text-sm px-3 py-1 rounded-full bg-accent/10 text-accent font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Design Preference */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Design Preference
              </h3>
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => onEdit(4)}
              >
                Edit
              </button>
            </div>
            <div>
              <Label className="text-muted-foreground">Design Style</Label>
              <p className="text-foreground font-medium text-base">
                {getDesignStyleLabel(design.designStyle)}
              </p>
            </div>
            {design.inspirationUrls && design.inspirationUrls.length > 0 && (
              <div className="mt-3">
                <Label className="text-muted-foreground">Inspiration URLs</Label>
                <div className="space-y-1 mt-1">
                  {design.inspirationUrls.map((url, index) => (
                    <p key={index} className="text-sm text-foreground break-all">
                      {url}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Budget</h3>
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => onEdit(5)}
              >
                Edit
              </button>
            </div>
            <div>
              <Label className="text-muted-foreground">Budget Range</Label>
              <p className="text-foreground font-medium text-base">
                {getBudgetLabel(budget.budgetRange)}
              </p>
            </div>
            {budget.budgetRange === "CUSTOM" && budget.budgetCustom && (
              <div className="mt-2">
                <Label className="text-muted-foreground">Custom Budget</Label>
                <p className="text-foreground font-medium text-base">
                  ₹{budget.budgetCustom.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attachments */}
        {attachments.length > 0 && (
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Uploaded Files ({attachments.length})
                </h3>
                <button
                  type="button"
                  className="text-sm text-accent hover:underline"
                  onClick={() => onEdit(6)}
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border-2 border-border bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.fileType || "Unknown type"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
