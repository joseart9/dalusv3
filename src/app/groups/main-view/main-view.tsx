"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { axiosClient } from "@/lib/axios-client";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { Group } from "@/app/types/group";
import { DatePicker } from "@/components/date-picker";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface MainViewProps {
  groups: Group[];
}

export function MainView({ groups }: MainViewProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<Partial<Group>>({
    defaultValues: selectedGroup || { group_id: "", name: "", date: "" },
    values: selectedGroup || { group_id: "", name: "", date: "" },
  });

  useEffect(() => {
    form.reset(selectedGroup || { group_id: "", name: "", date: "" });
  }, [selectedGroup, form]);

  const router = useRouter();

  // Utility to convert ISO to YYYY-MM-DD
  function isoToYMD(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const onSubmit = async (data: Partial<Group>) => {
    startTransition(async () => {
      try {
        if (selectedGroup) {
          await axiosClient.put("/groups", { ...data, id: selectedGroup.id });
          toast.success("Grupo actualizado correctamente");
          router.refresh();
        } else {
          await axiosClient.post("/groups", data);
          toast.success("Grupo creado correctamente");
          router.refresh();
        }
        setSelectedGroup(null);
        setCreateMode(false);
        form.reset({ group_id: "", name: "", date: "" });
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar el grupo");
      }
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-3 h-full border border-border rounded-lg p-4 bg-card">
        <div className="flex flex-row gap-2 items-center justify-between mb-4">
          <Button
            onClick={() => {
              setCreateMode(true);
              setSelectedGroup(null);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4" />
            Crear Grupo
          </Button>
        </div>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          {groups.map((group) => (
            <div key={group.id}>
              <Button
                className="w-full p-2 rounded-md"
                variant={selectedGroup?.id === group.id ? "default" : "outline"}
                onClick={() => {
                  setCreateMode(false);
                  setSelectedGroup(group);
                }}
              >
                {group.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-6">
        {(createMode || selectedGroup) && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Numero de grupo"
              placeholder="Numero de grupo"
              {...form.register("group_id", { required: true })}
            />
            <Input
              label="Nombre de grupo"
              placeholder="Nombre de grupo"
              {...form.register("name", { required: true })}
            />
            <DatePicker
              label="Fecha"
              value={isoToYMD(form.watch("date"))}
              onChange={(date: string | string[]) => {
                form.setValue("date", date as string);
              }}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-fit self-end"
            >
              {isPending ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Guardando...
                </>
              ) : selectedGroup ? (
                "Actualizar"
              ) : (
                "Guardar"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
