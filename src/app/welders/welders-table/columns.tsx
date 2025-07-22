import { ColumnDef } from "@tanstack/react-table";
import { Welder } from "@/app/types/welder";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Partial<Welder>>[] = [
  {
    header: "Nombre",
    accessorKey: "first_name",
  },
  {
    header: "Apellido Paterno",
    accessorKey: "paternal_last_name",
  },
  {
    header: "Apellido Materno",
    accessorKey: "maternal_last_name",
  },
  {
    header: "Correo Electrónico",
    accessorKey: "email",
  },
  {
    header: "Teléfono",
    accessorKey: "phone",
  },
  {
    header: "Status",
    accessorKey: "is_active",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }
        >
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
];
