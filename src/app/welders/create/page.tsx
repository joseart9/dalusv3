import { getGroups } from "@/server/services/groups";
import { CreateWelderForm } from "../create-welder-form/create-welder-form";

export default async function CreateWelderPage() {
  const groups = await getGroups();

  return (
    <>
      <CreateWelderForm groups={groups} />
    </>
  );
}
