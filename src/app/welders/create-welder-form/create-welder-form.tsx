"use client";

import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useTransition } from "react";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import { axiosClient } from "@/lib/axios-client";

// Types
import { Group } from "@/app/types/group";
import { Welder } from "@/app/types/welder";

// Form Components
import { WelderForm } from "./welder-form";
import { CertificationsForm } from "./certifications-form";
import { EndorsementsForm } from "./endorsements-form";

interface CreateWelderFormProps {
  initialState?: Partial<Welder>;
  groups: Group[];
}

export function CreateWelderForm({
  initialState,
  groups,
}: CreateWelderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Utility to convert ISO to YYYY-MM-DD
  function isoToYMD(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Transform certifications dates if present
  const transformedInitialState =
    initialState && initialState.certifications
      ? {
          ...initialState,
          certifications: initialState.certifications.map((cert) => ({
            ...cert,
            start_date: isoToYMD(cert.start_date),
            end_date: isoToYMD(cert.end_date),
          })),
        }
      : initialState;

  const methods = useForm<Partial<Welder>>({
    defaultValues: {
      is_active: transformedInitialState?.is_active ?? true,
      ...transformedInitialState,
    },
  });
  const { register, control, handleSubmit } = methods;

  const onSubmit = (data: Partial<Welder>) => {
    startTransition(async () => {
      try {
        if (initialState) {
          await axiosClient.put(`/welders`, data);
        } else {
          await axiosClient.post("/welders", data);
        }
        const msg = initialState
          ? "Soldador actualizado correctamente"
          : "Soldador creado correctamente";
        toast.success(msg);
        router.push("/welders");
      } catch (error: unknown) {
        let serverMsg = "Ocurrió un error";
        if (error && typeof error === "object" && "response" in error) {
          // @ts-expect-error: error is likely an AxiosError and has a response property
          serverMsg = error.response?.data?.error || serverMsg;
        }
        toast.error(serverMsg);
      }
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div></div>
        <div>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Button>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <WelderForm register={register} control={control} groups={groups} />
          <CertificationsForm />
          <EndorsementsForm />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {initialState ? "Actualizar" : "Guardar"}
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
