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

export function checkDateRange(currentDay: number, start: number, end: number): boolean {
  return currentDay >= start && currentDay <= end;
}

export function getCurrentDay(): number {
  return new Date().getDate();
}