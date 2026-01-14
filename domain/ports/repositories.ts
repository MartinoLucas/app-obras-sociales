import type { Professional, DocumentKind, ExportRow } from '@/domain/entities';

export interface IProfessionalRepo {
  findByEmail(email: string): Promise<Professional | null>;
  findById(id: string): Promise<Professional | null>;
  approve(id: string): Promise<void>;
  upsert(pro: Professional): Promise<Professional>;
}

export interface IEnrollmentRepo {
  addEnrollment(pId: string, y: number, m: number): Promise<void>;
  addUnenrollment(pId: string, y: number, m: number): Promise<void>;
  firstEnrollmentDate(pId: string): Promise<Date | null>;
}

export interface IDocumentRepo {
  upsert(proId: string, kind: DocumentKind, url: string): Promise<void>;
  list(proId: string): Promise<Array<{ kind: DocumentKind; url: string; uploadedAt: Date }>>;
}

export interface IExportRepo {
  byObraSocial(year: number, month: number): Promise<ExportRow[]>;
  byLocalidad(year: number, month: number): Promise<ExportRow[]>;
  byPractica(year: number, month: number): Promise<ExportRow[]>;
}
