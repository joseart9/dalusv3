import { getWelder } from "@/server/services/welders";
import { getGroups } from "@/server/services/groups";
import { notFound } from "next/navigation";
import { CreateWelderForm } from "../../create-welder-form/create-welder-form";

export async function EditWelderContent({ id }: { id: string }) {
  const { data: welder } = await getWelder(id);
  const groups = await getGroups();

  if (!welder) {
    notFound();
  }

  return <CreateWelderForm initialState={welder} groups={groups} />;
}
