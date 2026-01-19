// app/(dashboard)/inscripcion/profile-form.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { FormTemplate } from "@/components/forms/FormTemplate";
import { FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/forms/fields/TextField";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile, unsubscribeProfessional } from "@/app/actions/profile";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

// Modal simple usando Tailwind y estado (para no depender de librerías extra de UI si no las tienes instaladas)
function ConfirmModal({ isOpen, onClose, onConfirm, loading }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4 border-2 border-red-100">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-8 h-8" />
          <h3 className="text-lg font-bold">Confirmar Baja</h3>
        </div>
        <p className="text-gray-600 text-sm">
          ¿Estás seguro que deseas darte de baja del sistema? Esta acción podría afectar tu facturación actual.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Procesando..." : "Confirmar Baja"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Esquema de validación
const profileSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  matricula: z.string(),
  dni: z.string(),
  domicilio: z.string().min(3, "Domicilio requerido"),
  telefono: z.string().min(6, "Teléfono requerido"),
  email: z.string().email(),
});

export function ProfileForm({ defaultValues }: { defaultValues: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingBaja, setLoadingBaja] = useState(false);
  const router = useRouter();

  // Verificar fecha para botón de baja
  const day = new Date().getDate();
  const canUnsubscribe = day >= 1 && day <= 25;

  const handleUnsubscribe = async () => {
    setLoadingBaja(true);
    const error = await unsubscribeProfessional();
    setLoadingBaja(false);
    
    if (error) {
      toast.error(error);
      setShowModal(false);
    } else {
      toast.success("Baja realizada correctamente");
      router.push("/login"); // O a donde corresponda
    }
  };

  return (
    <>
      <ConfirmModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onConfirm={handleUnsubscribe}
        loading={loadingBaja}
      />

      <FormTemplate
        schema={profileSchema}
        title="Mis Datos Personales"
        description="Verifica y actualiza tu información de contacto."
        defaultValues={defaultValues}
        submitText="Guardar Cambios"
        // Si no estamos editando, ocultamos el footer con CSS o dejamos los botones pero deshabilitados visualmente
        className={!isEditing ? "opacity-100" : ""} 

        // Si no esta editando, bloqueamos los campos
        readonly={!isEditing}

        hasBackTo={false}
        
        // ✅ HEADER ACTIONS: Botones de Editar y Baja
        headerActions={
          <>
            {!isEditing ? (
               <Button onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                 <Pencil className="w-4 h-4 mr-2" />
                 Actualizar Datos
               </Button>
            ) : (
               <Button variant="ghost" onClick={(e) => { e.preventDefault(); setIsEditing(false); }}>
                 Cancelar Edición
               </Button>
            )}

            <Button 
                variant="destructive" 
                onClick={(e) => { e.preventDefault(); if(canUnsubscribe) setShowModal(true); else toast.error("La baja solo es del 1 al 25"); }}
                className={!canUnsubscribe ? "opacity-50 cursor-not-allowed" : ""}
                title={!canUnsubscribe ? "Solo disponible del 1 al 25" : ""}
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Darse de Baja
            </Button>
          </>
        }

        onSubmit={async (values) => {
          const error = await updateProfile(values);
          if (error) return error;
          setIsEditing(false); // Volver a bloquear campos tras guardar
          toast.success("Perfil actualizado");
        }}
      >
        {({ form }) => (
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campos que NO se suelen cambiar fácilmente */}
            <TextField control={form.control} name="nombre" label="Nombre" id="p-nombre" disabled />
            <TextField control={form.control} name="apellido" label="Apellido" id="p-apellido" disabled />
            <TextField control={form.control} name="matricula" label="Matrícula" id="p-mat" disabled />
            <TextField control={form.control} name="dni" label="DNI" id="p-dni" disabled />

            {/* Campos Editables (dependen de isEditing) */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="font-semibold text-gray-700 mb-4">Datos de Contacto</h3>
            </div>

            <TextField 
                control={form.control} 
                name="domicilio" 
                label="Domicilio Consultorio" 
                id="p-dom" 
                disabled={!isEditing} // 🔒 Grisado si no está editando
                className={!isEditing ? "opacity-60" : ""}
            />
            
            <TextField 
                control={form.control} 
                name="localidad" 
                label="Localidad (Solo lectura)" 
                id="p-loc" 
                disabled 
                description="Contactar admin para cambio de distrito."
            />

            <TextField 
                control={form.control} 
                name="telefono" 
                label="Teléfono" 
                id="p-tel" 
                disabled={!isEditing} 
                className={!isEditing ? "opacity-60" : ""}
            />
            
            <TextField 
                control={form.control} 
                name="email" 
                label="Correo Electrónico" 
                id="p-mail" 
                disabled={!isEditing} 
                className={!isEditing ? "opacity-60" : ""}
            />
            
            {/* Ocultamos el botón submit nativo del formulario si no estamos editando para evitar confusiones */}
            <style jsx global>{`
                #form-template button[type="submit"] {
                    display: ${isEditing ? 'inline-flex' : 'none'};
                }
            `}</style>
          </FieldGroup>
        )}
      </FormTemplate>
    </>
  );
}