// app/(auth)/login/page.tsx
"use client";

import * as React from "react";
import { z } from "zod";

import { loginProfessional, registerProfessional } from "@/app/actions/auth";
import { FormTemplate } from "@/components/forms/FormTemplate";
import { FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/forms/fields/TextField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import { toFormData } from "@/lib/utils";

// -------------------- Schema --------------------
const formSchema = z
  .object({
    email: z.string().min(1, "Ingresá el correo electrónico").email("Correo inválido"),
    password: z.string().min(1, "Ingresá la contraseña")
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export default function LoginPage() {
  return (
    <FormTemplate
      schema={formSchema}
      title="Ingreso"
      description="Ingreso para profesionales y administradores."
      defaultValues={{
        email: "",
        password: ""
      }}
      submitText="Ingresar"
      successToast="Ingreso correcto."
      onSubmit={async (values: FormOutput) => {
        const msg = await loginProfessional(null, toFormData(values as any));
        if (msg) return msg; // FormTemplate lo muestra como toast.error
      }}
      className="container mx-auto px-4 py-10 max-w-2xl"
    >
      {({ form }) => (
        <FieldGroup className="grid grid-cols-1 gap-4">
          <TextField
            control={form.control}
            name={"email"}
            label="Correo electrónico"
            id="reg-email"
            type="email"
            autoComplete="email"
          />
          <TextField
            control={form.control}
            name={"password"}
            label="Contraseña"
            id="reg-password"
            type="password"
            autoComplete="password"
          />
        </FieldGroup>
      )}
    </FormTemplate>
  );
}
