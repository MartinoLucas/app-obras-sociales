// src/domain/entities.ts

export type DocumentKind =
  | 'prestadores'
  | 'mala_praxis'
  | 'monotributo'
  | 'habilitacion';

export type Professional = {
  id: string;
  apellido: string;
  nombre: string;
  matricula: string;
  dni: string;
  domicilio: string;
  localidadId: string;
  telefono: string;
  email: string;
  passwordHash: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
};

export type ExportRow = Record<string, unknown>;
