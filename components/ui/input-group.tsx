// components/ui/input-group.tsx
"use client";

import * as React from "react";
import clsx from "clsx";
import { Textarea } from "@/components/ui/textarea"; // ya lo tenés en tu carpeta

export function InputGroup(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div {...rest} className={clsx("grid", className)} />;
}

export function InputGroupAddon(
  props: React.HTMLAttributes<HTMLDivElement> & { align?: "block-end" | "block-start" }
) {
  const { className, align = "block-end", ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(
        "flex",
        align === "block-end" ? "justify-end pt-1" : "justify-start pb-1",
        className
      )}
    />
  );
}

export function InputGroupText(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = props;
  return <span {...rest} className={clsx("text-xs text-muted-foreground", className)} />;
}

export const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function InputGroupTextarea({ className, ...rest }, ref) {
  return <Textarea ref={ref} {...rest} className={clsx("min-h-24 resize-none", className)} />;
});
