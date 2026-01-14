import { IDocumentRepo, IEnrollmentRepo } from '@/domain/ports/repositories';
import { isPastDeadline } from '@/domain/policies/documentPolicy';
import type { StorageAdapter } from '@/domain/ports/storage';

export class DocumentService {
  constructor(private docs: IDocumentRepo, private enroll: IEnrollmentRepo, private storage: StorageAdapter) {}

  async upload(proId: string, kind: 'prestadores'|'mala_praxis'|'monotributo'|'habilitacion', file: File) {
    const first = await this.enroll.firstEnrollmentDate(proId);
    if (first && isPastDeadline(first)) {
      throw new Error('Plazo de 3 meses vencido. Contacte al Distrito.');
    }
    const url = await this.storage.put(`docs/${proId}/${kind}`, file);
    await this.docs.upsert(proId, kind, url);
  }
}
