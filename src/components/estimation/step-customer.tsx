"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface StepCustomerProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export function StepCustomer({ form, onNext }: StepCustomerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(() => {
      onNext();
    })();
  };

  const errors = form.formState.errors;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Customer Information
        </h2>
        <p className="text-muted-foreground text-lg">
          {"Let's"} start with your contact details so we can reach you.
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer.fullName" className="text-base font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer.fullName"
                {...form.register("customer.fullName")}
                placeholder="John Doe"
                className={`h-12 ${(errors as any).customer?.fullName ? "border-destructive" : ""}`}
              />
              {(errors as any).customer?.fullName && (
                <p className="text-sm text-destructive mt-1">
                  {String((errors as any).customer.fullName.message || 'This field is required')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer.phone" className="text-base font-semibold">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer.phone"
                {...form.register("customer.phone")}
                placeholder="+91 98765 43210"
                className={`h-12 ${(errors as any).customer?.phone ? "border-destructive" : ""}`}
              />
              {(errors as any).customer?.phone && (
                <p className="text-sm text-destructive mt-1">
                  {String((errors as any).customer.phone.message || 'This field is required')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer.whatsapp" className="text-base font-semibold">WhatsApp Number</Label>
              <Input
                id="customer.whatsapp"
                {...form.register("customer.whatsapp")}
                placeholder="+91 98765 43210"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer.email" className="text-base font-semibold">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer.email"
                type="email"
                {...form.register("customer.email")}
                placeholder="john@example.com"
                className={`h-12 ${(errors as any).customer?.email ? "border-destructive" : ""}`}
              />
              {(errors as any).customer?.email && (
                <p className="text-sm text-destructive mt-1">
                  {String((errors as any).customer.email.message || 'This field is required')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer.city" className="text-base font-semibold">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer.city"
                {...form.register("customer.city")}
                placeholder="Mumbai"
                className={`h-12 ${(errors as any).customer?.city ? "border-destructive" : ""}`}
              />
              {(errors as any).customer?.city && (
                <p className="text-sm text-destructive mt-1">
                  {String((errors as any).customer.city.message || 'This field is required')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer.state" className="text-base font-semibold">
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer.state"
                {...form.register("customer.state")}
                placeholder="Maharashtra"
                className={`h-12 ${(errors as any).customer?.state ? "border-destructive" : ""}`}
              />
              {(errors as any).customer?.state && (
                <p className="text-sm text-destructive mt-1">
                  {String((errors as any).customer.state.message || 'This field is required')}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customer.preferredTime" className="text-base font-semibold">Preferred Contact Time</Label>
              <Input
                id="customer.preferredTime"
                {...form.register("customer.preferredTime")}
                placeholder="e.g., Morning (9 AM - 12 PM), Evening (5 PM - 8 PM)"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}