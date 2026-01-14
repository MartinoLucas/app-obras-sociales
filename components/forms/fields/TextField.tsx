"use client";

import * as React from "react";
import type { FieldValues, Path, Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  id: string;

  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  placeholder?: string;

  description?: string;
  className?: string;

  /**
   * Transform opcional: útil para "solo números", trim, etc.
   */
  transform?: (raw: string) => string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  id,
  type = "text",
  autoComplete,
  placeholder,
  description,
  className,
  transform,
  inputMode,
  pattern,
}: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            inputMode={inputMode}
            pattern={pattern}
            onChange={(e) => {
              const raw = e.target.value;
              field.onChange(transform ? transform(raw) : raw);
            }}
          />
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          {fieldState.invalid && fieldState.error ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
}
