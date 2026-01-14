// components/ui/field.tsx
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label"; // si no tenés label.tsx, debajo te dejo uno
import clsx from "clsx";

export function Field(props: React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }) {
  const { className, orientation = "vertical", ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(
        "group/field",
        orientation === "horizontal" ? "flex items-center justify-between gap-3" : "flex flex-col gap-2",
        className
      )}
    />
  );
}

export function FieldLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...rest } = props;
  return <Label {...rest} className={clsx("text-sm font-medium", className)} />;
}

export function FieldDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...rest } = props;
  return <p {...rest} className={clsx("text-xs text-muted-foreground", className)} />;
}

export function FieldError({ errors, className }: { errors: Array<{ message?: string | undefined }> | null | undefined; className?: string }) {
  if (!errors || !errors.length) return null;
  const msg = errors[0]?.message;
  if (!msg) return null;
  return <p className={clsx("text-sm text-red-600", className)}>{msg}</p>;
}

export function FieldGroup(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div {...rest} className={clsx("grid grid-cols-1 gap-3", className)} />;
}

// Minimal Label si no lo tenés (comenta este bloque si ya existe components/ui/label.tsx)
/*
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...rest } = props;
  return <label {...rest} className={clsx("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} />;
}
*/
