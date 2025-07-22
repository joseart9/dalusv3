import { Input } from "@/components/input";
import { Switch } from "@/components/switch";
import { Combobox } from "@/components/combobox";

// Types
import { Group } from "@/app/types/group";
import { Welder } from "@/app/types/welder";

import { Controller, UseFormRegister, Control } from "react-hook-form";

interface WelderFormProps {
  register: UseFormRegister<Partial<Welder>>;
  control: Control<Partial<Welder>>;
  groups: Group[];
}

export function WelderForm({ register, control, groups }: WelderFormProps) {
  return (
    <>
      <h2 className="text-lg font-bold">Información Personal</h2>
      <div className="grid grid-cols-2 gap-4 items-center">
        <Input
          {...register("first_name", { required: false })}
          label="Nombre"
          placeholder="Nombre del soldador"
          required
        />
        <Input
          {...register("middle_name")}
          label="Segundo Nombre"
          placeholder="Segundo Nombre del soldador"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <Input
          {...register("paternal_last_name")}
          label="Apellido Paterno"
          placeholder="Apellido Paterno del soldador"
        />
        <Input
          {...register("maternal_last_name")}
          label="Apellido Materno"
          placeholder="Apellido Materno del soldador"
        />
      </div>

      <h2 className="text-lg font-bold mt-6">Dirección</h2>
      <div className="grid grid-cols-3 gap-4 items-center">
        <Input
          {...register("address.street")}
          label="Calle"
          placeholder="Calle del soldador"
        />
        <Input
          {...register("address.number")}
          label="Número"
          placeholder="Número de la calle del soldador"
        />
        <Input
          {...register("address.city")}
          label="Ciudad"
          placeholder="Ciudad del soldador"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <Input
          {...register("address.state")}
          label="Estado"
          placeholder="Estado del soldador"
        />
        <Input
          {...register("address.zip_code")}
          label="Código Postal"
          placeholder="Código Postal del soldador"
        />
      </div>

      <h2 className="text-lg font-bold mt-6">Contacto</h2>
      <div className="grid grid-cols-2 gap-4 items-center">
        <Input
          {...register("phone")}
          label="Teléfono"
          placeholder="Teléfono del soldador"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <Input
          {...register("email", { required: true })}
          label="Email"
          placeholder="Email del soldador"
          required
        />
        <Input
          {...register("secondary_email")}
          label="Email Secundario"
          placeholder="Email Secundario del soldador"
        />
      </div>

      <h2 className="text-lg font-bold mt-6">Datos Adicionales</h2>
      <div className="grid grid-cols-2 gap-4 items-center">
        <Controller
          name="groups"
          control={control}
          render={({ field }) => (
            <Combobox
              name={field.name}
              label="Grupo"
              placeholder="Selecciona uno o más grupos..."
              options={groups.map((g) => ({
                label: g.name,
                value: String(g.id),
              }))}
              value={
                Array.isArray(field.value)
                  ? field.value.map((g) => String(g.id))
                  : []
              }
              onChange={(val: string | string[]) => {
                const selected = Array.isArray(val) ? val : val ? [val] : [];
                const selectedGroups = groups.filter((g) =>
                  selected.includes(String(g.id))
                );
                field.onChange(selectedGroups);
              }}
              multiple
            />
          )}
        />

        <div className="flex flex-col gap-4">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  label="Activo"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            name="is_in_waiting_list"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="is_in_waiting_list"
                  label="Lista de Espera"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <Input
          {...register("welder_id")}
          label="Identificador AWS"
          placeholder="Identificador AWS"
        />
      </div>
    </>
  );
}
