"use client";
import * as React from "react";
import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

// Versión simplificada usando HTML nativo select para no complicar con Radix UI ahora, 
// pero manteniendo tus estilos de Field.
export function SelectField({ control, name, label, options }: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>
          <select 
            {...field} 
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {options.map((o: any) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}