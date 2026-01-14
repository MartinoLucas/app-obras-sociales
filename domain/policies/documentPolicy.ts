export function graceDeadline(firstEnrollmentAt: Date): Date {
  const d = new Date(firstEnrollmentAt);
  d.setMonth(d.getMonth() + 3);
  return d;
}

export function isPastDeadline(firstEnrollmentAt: Date, now = new Date()): boolean {
  return now > graceDeadline(firstEnrollmentAt);
}
