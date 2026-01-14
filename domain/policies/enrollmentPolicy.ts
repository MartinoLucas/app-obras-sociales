const TZ = 'America/Argentina/Buenos_Aires';

export type WindowKind = 'enroll' | 'unenroll' | 'export';

export function isWithinWindow(date: Date, kind: WindowKind) {
  // Convertimos a TZ local para evaluar días del mes
  const local = new Date(date.toLocaleString('en-US', { timeZone: TZ }));
  const day = local.getDate();
  if (kind === 'export') return day >= 26 && day <= daysInMonth(local);
  return day >= 1 && day <= 25; // enroll/unenroll
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
