import { UsersTable } from "./users-table";
import { getUsers } from "@/server/services/users";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { AddUserDialog } from "./add-user-dialog";

// Types
import { User } from "@/app/types/users";

export default async function UsersPage(props: {
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
  } = await getUsers(query, page, pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" />
        <AddUserDialog />
      </div>
      <Suspense fallback={<Loading />}>
        <UsersTable
          data={data as Partial<User>[]}
          total={total}
          page={currentPage}
          pageSize={currentPageSize}
        />
      </Suspense>
    </div>
  );
}
