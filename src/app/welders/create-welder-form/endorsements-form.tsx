import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface WelderEndorsement {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function EndorsementsForm() {
  const { control } = useFormContext();
  const {
    fields: endorsementFields,
    append: appendEndorsement,
    remove: removeEndorsement,
  } = useFieldArray({
    control,
    name: "endorsements",
  });

  return (
    <div>
      <h2 className="text-lg font-bold mt-6 mb-2">Endorsements</h2>
      <div className="flex flex-col gap-4">
        {endorsementFields.map((field, index) => (
          <Card
            key={field.id}
            className="p-4 relative border border-muted shadow-sm"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => removeEndorsement(index)}
              aria-label="Eliminar endorsement"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-4">
              <Controller
                name={`endorsements.${index}.name`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nombre"
                    placeholder="Nombre del endorsement"
                    required
                  />
                )}
              />
            </div>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          className="self-start mt-2"
          onClick={() =>
            appendEndorsement({
              id: "",
              name: "",
              created_at: "",
              updated_at: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Agregar Endorsement
        </Button>
      </div>
    </div>
  );
}
