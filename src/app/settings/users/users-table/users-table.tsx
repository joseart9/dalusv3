"use client";

import { DataTable } from "@/components/table";
import { columns } from "./columns";
import { User } from "@/app/types/users";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  data: Partial<User>[];
  total: number;
  page: number;
  pageSize: number;
}

export const UsersTable = ({
  data,
  total,
  page,
  pageSize,
}: UsersTableProps) => {
  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));
    router.replace(`?${params.toString()}`);
  };

  return (
    <section className="h-full w-full overflow-x-auto">
      <div className="flex justify-end"></div>
      <DataTable columns={columns} data={data} />
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages} ({total} resultados)
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border bg-muted text-foreground disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            className="px-3 py-1 rounded border bg-muted text-foreground disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
};
