"use client";

import * as React from "react";
import type { FieldValues, Path, Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";

type TextareaFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  id: string;

  rows?: number;
  placeholder?: string;
  maxLength?: number;

  className?: string;
};

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  id,
  rows = 4,
  placeholder,
  maxLength,
  className,
}: TextareaFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const len = (field.value?.length ?? 0) as number;
        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id={id}
                rows={rows}
                placeholder={placeholder}
                aria-invalid={fieldState.invalid}
              />
              {typeof maxLength === "number" ? (
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {len}/{maxLength}
                  </InputGroupText>
                </InputGroupAddon>
              ) : null}
            </InputGroup>
            {fieldState.invalid && fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        );
      }}
    />
  );
}
