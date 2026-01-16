'use server';

import prisma from '@/lib/prisma';
import { hash, compare } from 'bcrypt'; // 1. Agregamos compare
import { setSession } from '@/lib/auth'; // 2. Importamos setSession
import { redirect } from 'next/navigation'; // 3. Importamos redirect

export async function registerProfessional(_: unknown, form: FormData) {
  // ... (Tu código de registro estaba bien, déjalo igual) ...
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

  return null;
}

export async function loginProfessional(_: unknown, form: FormData) {
  const email    = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');

  if (!email || !password) {
    return 'Completá todos los campos';
  }

  // 1. Buscamos al usuario
  const professional = await prisma.professional.findUnique({ where: { email } });
  
  // 2. Verificamos Usuario Y Contraseña (bcrypt.compare)
  if (!professional || !(await compare(password, professional.passwordHash))) {
    return 'Email o contraseña incorrectos';
  }

  // 3. Verificamos estado
  if (professional.status !== 'active') {
    return 'Tu cuenta no está activa. Contactate con el administrador.';
  }

  // 4. ✅ ESTO FALTABA: Crear la sesión (Cookie)
  await setSession(professional.id);

  // 5. ✅ ESTO FALTABA: Redirigir según el rol
  // (Nota: El redirect lanza un error interno de Next.js para navegar, por eso va al final)
  if (professional.role === 'admin') {
    redirect('/aceptacion-profesionales'); // O tu ruta de admin
  } else {
    redirect('/dashboard'); // Ruta para usuarios normales
  }
}