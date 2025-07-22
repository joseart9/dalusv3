import { WeldersTable } from "./welders-table";
import { getWelders } from "@/server/services/welders";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

// Types
import { Welder } from "@/app/types/welder";

export default async function WeldersPage(props: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const rawPageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize, 10)
    : 10;
  const pageSize = Math.max(1, Math.min(rawPageSize, 20));
  const {
    data,
    total,
    page: currentPage,
    pageSize: currentPageSize,
  } = await getWelders(query, page, pageSize);

  return (
    <Suspense fallback={<Loading />}>
      <WeldersTable
        data={data as Partial<Welder>[]}
        total={total}
        page={currentPage}
        pageSize={currentPageSize}
      />
    </Suspense>
  );
}
