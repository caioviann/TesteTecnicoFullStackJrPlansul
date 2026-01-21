/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RHFInputField, RHFSelectField } from "./form-fields";

interface DynamicFormProps<T extends z.ZodType<any, any, any>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  defaultValues?: Partial<z.infer<T>>;
  fields: Array<{
    name: keyof z.infer<T>;
    label: string;
    placeholder?: string;
    type?: string; // For input fields
    options?: { label: string; value: string }[]; // For select fields
    component: "input" | "select";
  }>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export function DynamicForm<T extends z.ZodType<any, any, any>>({
  schema,
  onSubmit,
  defaultValues,
  fields,
  submitButtonText = "Submit",
  isSubmitting = false,
}: DynamicFormProps<T>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((fieldConfig) => (
          <div key={fieldConfig.name as string}>
            {fieldConfig.component === "input" && (
              <RHFInputField
                name={fieldConfig.name as string}
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                type={fieldConfig.type}
              />
            )}
            {fieldConfig.component === "select" && (
              <RHFSelectField
                name={fieldConfig.name as string}
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                options={fieldConfig.options}
              />
            )}
          </div>
        ))}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
