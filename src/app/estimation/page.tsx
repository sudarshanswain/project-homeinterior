"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/estimation/step-indicator";
import { StepCustomer } from "@/components/estimation/step-customer";
import { StepProperty } from "@/components/estimation/step-property";
import { StepRooms } from "@/components/estimation/step-rooms";
import { StepServices } from "@/components/estimation/step-services";
import { StepDesign } from "@/components/estimation/step-design";
import { StepBudget } from "@/components/estimation/step-budget";
import { StepUpload } from "@/components/estimation/step-upload";
import { StepReview } from "@/components/estimation/step-review";
import {
  leadSubmissionSchema,
  customerInfoSchema,
  propertyDetailsSchema,
  roomsSchema,
  servicesSchema,
  designPreferenceSchema,
  budgetSchema,
  fileUploadSchema,
} from "@/lib/validations/lead";
import { useToast } from "@/hooks/use-toast";
import { Home, Phone, Clock, CheckCircle2 } from "lucide-react";
import type { EstimationFormValues } from "@/types/estimation-form";

const STEPS = [
  { number: 1, title: "Customer Info", description: "Contact details" },
  { number: 2, title: "Property", description: "Property details" },
  { number: 3, title: "Rooms", description: "Room configuration" },
  { number: 4, title: "Services", description: "Services needed" },
  { number: 5, title: "Design", description: "Design preference" },
  { number: 6, title: "Budget", description: "Budget range" },
  { number: 7, title: "Upload", description: "Files & images" },
  { number: 8, title: "Review", description: "Review & submit" },
];

const STORAGE_KEY = "estimation_draft";

export default function EstimationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{ leadId: string; leadNumber: string } | null>(null);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(false);
  const { success, error: showError } = useToast();

  const form = useForm<EstimationFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSubmissionSchema) as any,
    defaultValues: {
      customer: {
        fullName: "",
        phone: "",
        whatsapp: "",
        email: "",
        city: "",
        state: "",
        preferredTime: "",
      },
      property: {
        propertyType: "APARTMENT",
        configuration: "",
        totalArea: 0,
        status: "READY_TO_MOVE",
        expectedPossession: "",
      },
      rooms: {
        rooms: [],
      },
      services: {
        services: [],
      },
      design: {
        designStyle: "MODERN",
        inspirationUrls: [],
      },
      budget: {
        budgetRange: "10_20_LAKHS",
        budgetCustom: 0,
      },
      attachments: {
        files: [],
      },
      notes: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsLoadingFromStorage(true);
        form.reset(parsed);
        setTimeout(() => setIsLoadingFromStorage(false), 100);
      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    }
  }, [form]);

  const validateCurrentStep = useCallback(async () => {
    let schema;
    switch (currentStep) {
      case 0:
        schema = customerInfoSchema;
        break;
      case 1:
        schema = propertyDetailsSchema;
        break;
      case 2:
        schema = roomsSchema;
        break;
      case 3:
        schema = servicesSchema;
        break;
      case 4:
        schema = designPreferenceSchema;
        break;
      case 5:
        schema = budgetSchema;
        break;
      case 6:
        schema = fileUploadSchema;
        break;
      default:
        return true;
    }

    const data = form.getValues();
    const sectionData = currentStep === 0 ? data.customer :
                        currentStep === 1 ? data.property :
                        currentStep === 2 ? data.rooms :
                        currentStep === 3 ? data.services :
                        currentStep === 4 ? data.design :
                        currentStep === 5 ? data.budget :
                        data.attachments;

    const result = schema.safeParse(sectionData);
    if (!result.success) {
      const sectionFields = currentStep === 0 ? ['fullName', 'phone', 'email', 'city', 'state'] :
                           currentStep === 1 ? ['propertyType', 'totalArea', 'status'] :
                           currentStep === 2 ? ['rooms'] :
                           currentStep === 3 ? ['services'] :
                           currentStep === 4 ? ['designStyle'] :
                           currentStep === 5 ? ['budgetRange', 'budgetCustom'] :
                           ['files'];
      
      sectionFields.forEach(field => {
        const fieldPath = currentStep === 0 ? `customer.${field}` :
                          currentStep === 1 ? `property.${field}` :
                          currentStep === 2 ? `rooms.${field}` :
                          currentStep === 3 ? `services.${field}` :
                          currentStep === 4 ? `design.${field}` :
                          currentStep === 5 ? `budget.${field}` :
                          `attachments.${field}`;
        // @ts-expect-error - dynamic field path
        form.clearErrors(fieldPath);
      });

      Object.entries(result.error.flatten().fieldErrors).forEach(([field, errors]) => {
        const fieldPath = currentStep === 0 ? `customer.${field}` :
                          currentStep === 1 ? `property.${field}` :
                          currentStep === 2 ? `rooms.${field}` :
                          currentStep === 3 ? `services.${field}` :
                          currentStep === 4 ? `design.${field}` :
                          currentStep === 5 ? `budget.${field}` :
                          `attachments.${field}`;
        // @ts-expect-error - dynamic field path
        form.setError(fieldPath, { message: errors?.[0] || "Invalid" });
      });
      return false;
    }
    return true;
  }, [currentStep, form]);

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      showError("Please fix the errors before proceeding");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const data = form.getValues();

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit lead");
      }

      const result = await response.json();
      setSubmittedLead(result.data);

      localStorage.removeItem(STORAGE_KEY);

      success(`Your lead has been submitted successfully. Lead Number: ${result.data.leadNumber}`);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndContinueLater = () => {
    const data = form.getValues();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    success("Your progress has been saved. You can continue later.");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepCustomer form={form} onNext={handleNext} />;
      case 1:
        return (
          <StepProperty
            form={form}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepRooms
            form={form}
            onNext={handleNext}
            onBack={handleBack}
            configuration={form.watch("property.configuration") || "Custom"}
            totalArea={form.watch("property.totalArea") || 0}
          />
        );
      case 3:
        return (
          <StepServices
            form={form}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <StepDesign
            form={form}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepBudget
            form={form}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <StepUpload
            form={form}
            onNext={handleNext}
          />
        );
      case 7:
        return (
          <StepReview
            form={form}
            onNext={handleSubmit}
            onBack={handleBack}
            onEdit={handleEdit}
          />
        );
      default:
        return null;
    }
  };

  if (submittedLead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Thank You for Your Submission!
              </h1>
              <p className="text-muted-foreground">
                {"We've"} received your project estimation request. Our team will contact you within 24 hours.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your Lead Number</p>
                  <p className="text-2xl font-bold text-accent">{submittedLead.leadNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    Please save this number for future reference
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>What happens next?</p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                <li>Our design consultant will review your requirements</li>
                <li>{"We'll"} contact you at your preferred time</li>
                <li>Schedule a site visit if needed</li>
                <li>Provide you with a detailed quotation</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setSubmittedLead(null);
                  setCurrentStep(0);
                  form.reset();
                }}
                variant="outline"
              >
                Submit Another Request
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
              >
                Return to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoadingFromStorage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">Loading your saved draft...</div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-border/40">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Get Your Dream Home Estimate
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions and receive a personalized quotation within 24 hours.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-border/40">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent to-accent/80 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                  <Home className="w-32 h-32 text-accent/40" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    <span>Have your property details ready for accurate estimation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    <span>Upload floor plans for better understanding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    <span>Be specific about your requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Your Progress</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Property Type</p>
                    <p className="text-sm font-semibold text-foreground">
                      {form.watch("property.propertyType")?.replace(/_/g, ' ') || "Not set"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Configuration</p>
                    <p className="text-sm font-semibold text-foreground">
                      {form.watch("property.configuration") || "Not set"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Total Area</p>
                    <p className="text-sm font-semibold text-foreground">
                      {form.watch("property.totalArea") ? `${form.watch("property.totalArea")} sq ft` : "Not set"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Rooms Generated</p>
                    <p className="text-sm font-semibold text-foreground">
                      {(form.watch("rooms.rooms") || []).length} rooms
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Rooms Completed</p>
                    <p className="text-sm font-semibold text-foreground">
                      {(() => {
                        const rooms = form.watch("rooms.rooms") || [];
                        const completed = rooms.filter((r: { dimensionMode?: string; length?: number; width?: number; area?: number }) => {
                          if (r.dimensionMode === "LENGTH_WIDTH") return (r.length ?? 0) > 0 && (r.width ?? 0) > 0;
                          return (r.area ?? 0) > 0;
                        }).length;
                        return `${completed} / ${rooms.length}`;
                      })()}
                    </p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-accent h-1.5 rounded-full transition-all"
                        style={{ width: `${(() => {
                          const rooms = form.watch("rooms.rooms") || [];
                          return rooms.length > 0 ? ((rooms.filter((r: { dimensionMode?: string; length?: number; width?: number; area?: number }) => {
                            if (r.dimensionMode === "LENGTH_WIDTH") return (r.length ?? 0) > 0 && (r.width ?? 0) > 0;
                            return (r.area ?? 0) > 0;
                          }).length / rooms.length) * 100) : 0;
                        })()}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">Services</p>
                    <p className="text-sm font-semibold text-foreground">
                      {(form.watch("services.services") || []).length} selected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <Clock className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Estimated Time</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete this form in approximately <span className="font-semibold text-foreground">5-7 minutes</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Get your detailed quotation within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Need Help?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our design consultants are here to assist you
                </p>
                <Button className="w-full" variant="default">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-10">
                <div className="mb-8">
                  <StepIndicator
                    steps={STEPS}
                    currentStep={currentStep}
                    onStepClick={(step) => {
                      if (step < currentStep) {
                        setCurrentStep(step);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  />
                </div>

                <FormProvider {...form}>
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStep()}
                  </motion.div>
                </FormProvider>

                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
                  <div>
                    {currentStep > 0 && (
                      <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                        Back
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={handleSaveAndContinueLater}
                    >
                      Save Draft
                    </Button>
                    {currentStep < STEPS.length - 1 && (
                      <Button type="button" size="lg" onClick={handleNext}>
                        Continue
                      </Button>
                    )}
                    {currentStep === STEPS.length - 1 && (
                      <Button
                        type="button"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Free Consultation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>No Hidden Charges</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Dedicated Designer</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Response within 24 Hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}