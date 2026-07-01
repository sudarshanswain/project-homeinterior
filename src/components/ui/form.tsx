"use client";

import * as React from "react";
import {
  useForm as useReactHookForm,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormProps<TFormValues extends Record<string, any>> {
  onSubmit: (data: TFormValues) => void;
  children: React.ReactNode;
  className?: string;
}

export function Form<TFormValues extends Record<string, any>>({
  onSubmit,
  children,
  className,
}: FormProps<TFormValues>) {
  const form = useFormContext<TFormValues>();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      {children}
    </form>
  );
}

export { useReactHookForm as useForm, FormProvider, useFormContext };