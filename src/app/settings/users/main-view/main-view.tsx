import { getUsers } from "@/server/services/users";

export async function UsersMainView() {
  const { total } = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>
      <div className="text-sm text-muted-foreground">
        Total de usuarios: {total}
      </div>
    </div>
  );
}
