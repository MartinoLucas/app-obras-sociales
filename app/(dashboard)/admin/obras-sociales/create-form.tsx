"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createObraSocial } from "@/app/actions/admin"; // Server Action nueva
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function CreateObraSocialForm() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const res = await createObraSocial(data.nombre);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Obra Social agregada");
      reset();
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
      <Input {...register("nombre", { required: true })} placeholder="Nombre de la Obra Social (Ej: OSDE)" className="max-w-md" />
      <Button type="submit">Agregar</Button>
    </form>
  );
}