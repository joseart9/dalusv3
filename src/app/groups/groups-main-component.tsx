import { MainView } from "@/app/groups/main-view";
import { getGroups } from "@/server/services/groups";

export async function GroupsMainComponent() {
  const groups = await getGroups();
  return <MainView groups={groups} />;
}
