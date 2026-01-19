// services/documentService.ts
import { IDocumentRepo, IEnrollmentRepo } from '@/domain/ports/repositories';
import { isPastDeadline } from '@/domain/policies/documentPolicy';
import type { StorageAdapter } from '@/domain/ports/storage';
import path from 'path'; // ✅ Importamos path para sacar la extensión

export class DocumentService {
  constructor(private docs: IDocumentRepo, private enroll: IEnrollmentRepo, private storage: StorageAdapter) {}

  async upload(proId: string, kind: 'prestadores'|'mala_praxis'|'monotributo'|'habilitacion', file: File) {
    const first = await this.enroll.firstEnrollmentDate(proId);
    if (first && isPastDeadline(first)) {
      throw new Error('Plazo de 3 meses vencido. Contacte al Distrito.');
    }

    // ✅ CORRECCIÓN: Obtener la extensión del archivo original
    // file.name suele ser "mi-archivo.pdf" -> ext será ".pdf"
    const ext = path.extname(file.name) || '.pdf'; // Default a pdf si falla
    
    // Ahora la key tiene extensión: "docs/abc-123/monotributo.pdf"
    const key = `docs/${proId}/${kind}${ext}`; 

    const url = await this.storage.put(key, file);
    await this.docs.upsert(proId, kind, url);
  }
}