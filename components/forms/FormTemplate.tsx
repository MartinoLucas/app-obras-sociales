"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { z } from "zod";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
  Resolver,
  DefaultValues,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type AnyZodObject = z.ZodObject;

type ValuesOf<TSchema extends AnyZodObject> = z.infer<TSchema> & FieldValues;

type FormTemplateProps<TSchema extends AnyZodObject> = {
  schema: TSchema;

  title: string;
  description?: string;

  defaultValues: DefaultValues<ValuesOf<TSchema>>;

  onSubmit: (values: ValuesOf<TSchema>) => Promise<string | void>;

  submitText?: string;
  submittingText?: string;
  resetText?: string;
  successToast?: string;

  children: (ctx: {
    form: UseFormReturn<ValuesOf<TSchema>>;
    isPending: boolean;
  }) => ReactNode;

  formId?: string;
  className?: string;
};

export function FormTemplate<TSchema extends AnyZodObject>({
  schema,
  title,
  description,
  defaultValues,
  onSubmit,
  submitText = "Guardar",
  submittingText = "Enviando…",
  resetText = "Limpiar",
  successToast = "Listo.",
  children,
  formId = "form-template",
  className,
}: FormTemplateProps<TSchema>) {
  const [isPending, startTransition] = React.useTransition();

  // 👇 Anclamos el resolver al tipo de RHF para evitar el choque input/output
  const resolver = zodResolver(schema) as unknown as Resolver<ValuesOf<TSchema>>;

  const form = useForm<ValuesOf<TSchema>>({
    resolver,
    defaultValues,
    mode: "onTouched",
  });

  const handleSubmit: SubmitHandler<ValuesOf<TSchema>> = (values) => {
    startTransition(async () => {
      try {
        const maybeError = await onSubmit(values);
        if (typeof maybeError === "string" && maybeError.trim().length > 0) {
          toast.error(maybeError);
          return;
        }
        toast.success(successToast);
        form.reset();
      } catch {
        toast.error("Ocurrió un error inesperado.");
      }
    });
  };

  return (
    <main
      className={
        className ??
        "container mx-auto px-4 py-10 max-w-3xl md:max-w-4xl lg:max-w-7xl"
      }
    >
      <Card className="w-full p-6 md:p-8 shadow-lg bg-gray-50">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-sm md:text-base">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>

        <CardContent>
          <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
            {children({ form, isPending })}
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal" className="justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              {resetText}
            </Button>
            <Button type="submit" form={formId} disabled={isPending}>
              {isPending ? submittingText : submitText}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </main>
  );
}
