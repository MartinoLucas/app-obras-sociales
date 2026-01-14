import { IExportRepo } from '@/domain/ports/repositories';

export async function toCsv(rows: Array<Record<string, any>>): Promise<string> {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const body = rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')).join('\n');
  return headers.join(',') + '\n' + body;
}
