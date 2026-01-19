"use client";
import * as React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

export function FileField({ control, name, label, description }: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>
          <Input
            {...field}
            type="file"
            onChange={(e) => {
              // React Hook Form espera el archivo, no el evento
              onChange(e.target.files?.[0]); 
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}