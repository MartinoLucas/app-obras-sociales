"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, value, defaultValue, ...props }, ref) => {
    // si viene `value` (controlado) y es `undefined`, lo normalizamos a ""
    const normalized =
      value !== undefined ? (value as string | number | readonly string[] | null) ?? "" : undefined;

    return (
      <input
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        // Si hay `value` (controlado), uso el normalizado; si no, dejo `defaultValue` (no controlado)
        {...(normalized !== undefined ? { value: normalized } : { defaultValue })}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
