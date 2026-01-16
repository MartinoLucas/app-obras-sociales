"use client";

import * as React from "react";
import { z } from "zod";

import { registerProfessional } from "@/app/actions/auth";
import { FormTemplate } from "@/components/forms/FormTemplate";
import { FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/forms/fields/TextField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import { toFormData } from "@/lib/utils";
import { useRouter } from "next/navigation";

// -------------------- Schema --------------------
const formSchema = z
  .object({
    apellido: z.string().min(2, "Ingresá tu apellido"),
    nombre: z.string().min(2, "Ingresá tu nombre"),
    matricula: z.string().min(1, "Ingresá la matrícula").regex(/^\d+$/, "Sólo números"),
    dni: z.string().min(1, "Ingresá el DNI").regex(/^\d+$/, "Sólo números"),
    domicilio: z.string().min(3, "Ingresá el domicilio del consultorio"),
    localidad: z.string().min(2, "Ingresá la localidad"),
    telefono: z.string().min(6, "Ingresá un teléfono"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    passwordConfirm: z.string().min(6, "Repetí la contraseña"),
    observaciones: z.string().max(200, "Máximo 200 caracteres").default(""),
  })
  .superRefine((vals, ctx) => {
    if (vals.password !== vals.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export default function RegisterPage() {

  const router = useRouter();

  return (
    <FormTemplate
      schema={formSchema}
      title="Registro de Profesional"
      description="Completá tus datos para solicitar acceso."
      defaultValues={{
        apellido: "",
        nombre: "",
        matricula: "",
        dni: "",
        domicilio: "",
        localidad: "",
        telefono: "",
        email: "",
        password: "",
        passwordConfirm: "",
        observaciones: "",
      }}
      submitText="Crear cuenta"
      successToast="Registro enviado. Queda pendiente de aprobación."
      toastData={{ duration: 10000 }}
      onSubmit={async (values: FormOutput) => {
        const msg = await registerProfessional(null, toFormData(values as any));
        if (msg) return msg; // FormTemplate lo muestra como toast.error
        router.push("/");
      }}
    >
      {({ form }) => (
        <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField control={form.control} name={"apellido"} label="Apellido" id="reg-apellido" autoComplete="family-name" />
          <TextField control={form.control} name={"nombre"} label="Nombre" id="reg-nombre" autoComplete="given-name" />

          <TextField
            control={form.control}
            name={"dni"}
            label="DNI"
            id="reg-dni"
            inputMode="numeric"
            pattern="\d*"
            transform={(v) => v.replace(/\D/g, "")}
          />

          <TextField
            control={form.control}
            name={"matricula"}
            label="N° Matrícula"
            id="reg-matricula"
            className="md:col-span-2"
            inputMode="numeric"
            pattern="\d*"
            transform={(v) => v.replace(/\D/g, "")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-3">
            <TextField control={form.control} name={"domicilio"} label="Domicilio del consultorio" id="reg-domicilio" autoComplete="street-address" />
            <TextField control={form.control} name={"localidad"} label="Localidad" id="reg-localidad" />
          </div>

          <TextField control={form.control} name={"telefono"} label="Teléfono" id="reg-telefono" inputMode="tel" autoComplete="tel" />

          <TextField
            control={form.control}
            name={"email"}
            label="Correo electrónico"
            id="reg-email"
            className="md:col-span-2"
            type="email"
            autoComplete="email"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-3">
            <TextField
              control={form.control}
              name={"password"}
              label="Contraseña"
              id="reg-password"
              type="password"
              autoComplete="new-password"
              description="Mínimo 6 caracteres."
            />
            <TextField
              control={form.control}
              name={"passwordConfirm"}
              label="Repetir contraseña"
              id="reg-password2"
              type="password"
              autoComplete="new-password"
            />
          </div>

          <TextareaField
            control={form.control}
            name={"observaciones"}
            label="Observaciones (opcional)"
            id="reg-observaciones"
            className="md:col-span-3"
            placeholder="Algo que quieras aclarar…"
            rows={4}
            maxLength={200}
          />
        </FieldGroup>
      )}
    </FormTemplate>
  );
}
