import { ColumnDef } from "@tanstack/react-table";
import { User, Role } from "@/app/types/users";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Partial<User>>[] = [
  {
    header: "Nombre",
    accessorKey: "first_name",
  },
  {
    header: "Apellido",
    accessorKey: "last_name",
  },
  {
    header: "Correo Electrónico",
    accessorKey: "email",
  },
  {
    header: "Rol",
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Role;
      return (
        <Badge
          variant={role === Role.ADMIN ? "default" : "secondary"}
          className={
            role === Role.ADMIN
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-500 hover:bg-gray-600"
          }
        >
          {role === Role.ADMIN ? "Administrador" : "Usuario"}
        </Badge>
      );
    },
  },
  {
    header: "Fecha de Creación",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
];
