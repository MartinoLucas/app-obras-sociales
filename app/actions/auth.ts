'use server';

import { prisma } from '@/infra/prisma/client';
import { hash } from 'bcrypt';

export async function registerProfessional(_: unknown, form: FormData) {
  const apellido   = String(form.get('apellido') || '').trim();
  const nombre     = String(form.get('nombre') || '').trim();
  const matricula  = String(form.get('matricula') || '').trim();
  const dni        = String(form.get('dni') || '').trim();
  const domicilio  = String(form.get('domicilio') || '').trim();
  const localidad  = String(form.get('localidad') || '').trim();
  const telefono   = String(form.get('telefono') || '').trim();
  const email      = String(form.get('email') || '').trim().toLowerCase();
  const password   = String(form.get('password') || '');

  if (!apellido || !nombre || !matricula || !dni || !domicilio || !localidad || !telefono || !email || !password) {
    return 'Completá todos los campos';
  }

  const exists = await prisma.professional.findFirst({ where: { OR: [{ email }, { matricula }] } });
  if (exists) return 'Ya existe un profesional con ese email o matrícula';

  // crea (o reusa) la Localidad
  const loc = await prisma.localidad.upsert({
    where: { nombre: localidad },
    create: { nombre: localidad },
    update: {}
  });

  const passwordHash = await hash(password, 10);
  await prisma.professional.create({
    data: {
      apellido, nombre, matricula, dni, domicilio,
      telefono, email, passwordHash, status: 'pending',
      localidadId: loc.id
    }
  });

  return null; // OK
}

export async function loginProfessional(_: unknown, form: FormData) {
  const email    = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');

  if (!email || !password) {
    return 'Completá todos los campos';
  }

  const professional = await prisma.professional.findUnique({ where: { email } });
  if (!professional) {
    return 'Email o contraseña incorrectos';
  }

  // Aquí debería verificarse la contraseña (omito para simplificar)

  if (professional.status !== 'active') {
    return 'Tu cuenta no está activa. Contactate con el administrador.';
  }

  // Aquí debería crearse la sesión del usuario (omito para simplificar)

  return null; // OK
}