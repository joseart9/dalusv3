/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import {
  useFormContext,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios-client";
import { DatePicker } from "@/components/date-picker";

const CERTIFICATION_TYPES = [
  { label: "AWS", value: "AWS" },
  { label: "IPC", value: "IPC" },
  { label: "CUSTOM", value: "CUSTOM" },
];

export function CertificationsForm() {
  const { control } = useFormContext();
  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <div>
      <h2 className="text-lg font-bold mt-6 mb-2">Certificaciones</h2>
      <div className="flex flex-col gap-4">
        {certificationFields.map((field, index) => (
          <Card
            key={field.id}
            className="p-4 relative border border-muted shadow-sm"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => removeCertification(index)}
              aria-label="Eliminar certificación"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <CertificationFields index={index} control={control} />
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          className="self-start mt-2"
          onClick={() =>
            appendCertification({
              certification_id: "",
              type: "",
              certification_primitive: "",
              level: "",
              start_date: "",
              end_date: "",
              endorsements: [],
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Agregar Certificación
        </Button>
      </div>
    </div>
  );
}

function CertificationFields({
  index,
  control,
}: {
  index: number;
  control: any;
}) {
  const {
    fields: endorsementFields,
    append: appendEndorsement,
    remove: removeEndorsement,
  } = useFieldArray({
    control,
    name: `certifications.${index}.endorsements`,
  });

  // Watch the type for this certification
  const type = useWatch({
    control,
    name: `certifications.${index}.type`,
  });

  // State for primitives
  const [primitiveOptions, setPrimitiveOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) {
      setPrimitiveOptions([]);
      return;
    }
    setLoading(true);
    axiosClient
      .get(`/certifications?type=${type}`)
      .then((res) => {
        const options = (res.data?.data || []).map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setPrimitiveOptions(options);
      })
      .catch(() => setPrimitiveOptions([]))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name={`certifications.${index}.certification_id`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nombre de la certificación"
              placeholder="Nombre de la certificación"
              required
            />
          )}
        />
        <Controller
          name={`certifications.${index}.type`}
          control={control}
          render={({ field }) => (
            <Combobox
              label="Tipo de Certificación"
              placeholder="Selecciona un tipo..."
              options={CERTIFICATION_TYPES}
              value={field.value || ""}
              onChange={field.onChange}
              name={field.name}
              required
            />
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name={`certifications.${index}.certification_primitive`}
          control={control}
          render={({ field }) => (
            <Combobox
              label="Certificación"
              placeholder={
                loading
                  ? "Cargando..."
                  : !type
                  ? "Selecciona un tipo de certificación..."
                  : "Selecciona una certificación..."
              }
              options={primitiveOptions}
              value={field.value?.id || field.value || ""}
              onChange={(val) => field.onChange(val)}
              name={field.name}
              disabled={loading || !type}
              required
            />
          )}
        />
        <Controller
          name={`certifications.${index}.level`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nivel"
              placeholder="Nivel de la certificación"
            />
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name={`certifications.${index}.start_date`}
          control={control}
          render={({ field }) => (
            <DatePicker {...field} label="Fecha de Inicio" />
          )}
        />
        <Controller
          name={`certifications.${index}.end_date`}
          control={control}
          render={({ field }) => <DatePicker {...field} label="Fecha de Fin" />}
        />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Endorsements</h3>
        <div className="flex flex-col gap-2">
          {endorsementFields.map((endorsement, eIdx) => (
            <div key={endorsement.id} className="flex items-center gap-2">
              <Controller
                name={`certifications.${index}.endorsements.${eIdx}.name`}
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
              <button
                type="button"
                className="text-red-500 hover:text-red-700 mt-6 cursor-pointer"
                onClick={() => removeEndorsement(eIdx)}
                aria-label="Eliminar endorsement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="self-start mt-2"
            onClick={() => appendEndorsement({ name: "" })}
          >
            <Plus className="w-4 h-4 mr-1" /> Agregar Endorsement
          </Button>
        </div>
      </div>
    </div>
  );
}
