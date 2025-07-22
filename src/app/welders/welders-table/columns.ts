import { ColumnDef } from "@tanstack/react-table";
import { Welder } from "@/app/types/welder";

export const columns: ColumnDef<Partial<Welder>>[] = [
  {
    header: "Nombre",
    accessorKey: "first_name",
  },
  {
    header: "Apellido Paterno",
    accessorKey: "paternal_last_name",
  },
];
