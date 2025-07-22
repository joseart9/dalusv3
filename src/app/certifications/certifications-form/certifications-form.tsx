"use client";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { CertificationPrimitive } from "@/app/types/certification-primitive";
import { Combobox } from "@/components/combobox";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/spinner";
import { AxiosInstance } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TYPES = [
  { label: "AWS", value: "AWS" },
  { label: "IPC", value: "IPC" },
  { label: "CUSTOM", value: "CUSTOM" },
];

interface CertificationsFormProps {
  certificationPrimitive?: CertificationPrimitive;
  axiosClient: AxiosInstance;
}

export const CertificationsForm = ({
  certificationPrimitive,
  axiosClient,
}: CertificationsFormProps) => {
  const [type, setType] = useState(certificationPrimitive?.type ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const certification = Object.fromEntries(
      formData
    ) as unknown as Partial<CertificationPrimitive>;

    if (certificationPrimitive) {
      startTransition(async () => {
        const certificationToUpdate = {
          ...certification,
          id: certificationPrimitive.id,
        };
        try {
          await axiosClient.put(`/certifications`, certificationToUpdate);
          toast.success("Certificación actualizada correctamente");
          router.push("/certifications");
        } catch (error) {
          console.error(error);
          toast.error("Error al actualizar la certificación");
        }
      });
    } else {
      startTransition(async () => {
        try {
          await axiosClient.post("/certifications", certification);
          toast.success("Certificación creada correctamente");
        } catch (error) {
          console.error(error);
          toast.error("Error al crear la certificación");
        }
      });
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Combobox
          name="type"
          options={TYPES}
          value={type}
          onChange={(val: string | string[]) => setType(val as string)}
          label="Tipo de certificación"
          required
          placeholder="Selecciona un tipo de certificación..."
        />
        {/* Hidden input to ensure 'type' is included in formData */}
        <input type="hidden" name="type" value={type} />
        <Input
          name="name"
          type="text"
          placeholder="Nombre de la certificación"
          defaultValue={certificationPrimitive?.name}
          label="Nombre de la certificación"
          required
        />
        <Button type="submit" disabled={isPending} className="w-fit self-end">
          {isPending ? (
            <>
              <Spinner className="w-4 h-4" />
              Guardando...
            </>
          ) : certificationPrimitive ? (
            "Actualizar"
          ) : (
            "Guardar"
          )}
        </Button>
      </form>
    </>
  );
};
