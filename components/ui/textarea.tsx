"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"textarea">;

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ className, value, defaultValue, ...props }, ref) => {
    const normalized =
      value !== undefined ? (value as string | number | readonly string[] | null) ?? "" : undefined;

    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...(normalized !== undefined ? { value: normalized } : { defaultValue })}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
