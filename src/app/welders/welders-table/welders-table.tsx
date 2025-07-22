"use client";

import { DataTable } from "@/components/table";
import { columns } from "./columns";
import { Welder } from "@/app/types/welder";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface WeldersTableProps {
  data: Partial<Welder>[];
  total: number;
  page: number;
  pageSize: number;
}

export const WeldersTable = ({
  data,
  total,
  page,
  pageSize,
}: WeldersTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("q", value);
    }
    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));
    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Input
          placeholder="Buscar soldador..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            const params = new URLSearchParams(window.location.search);
            if (e.target.value) {
              params.set("q", e.target.value);
            } else {
              params.delete("q");
            }
            params.set("page", "1"); // Reset to first page on search
            params.set("pageSize", String(pageSize));
            router.replace(`?${params.toString()}`);
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        onRowClick={(row) => router.push(`/welders/welder/${row.id}`)}
      />
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
    </>
  );
};
