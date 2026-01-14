import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toFormData(obj: Record<string, unknown>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) fd.append(k, String(v ?? ""));
  return fd;
}
