import { Suspense } from "react";
import { GroupsMainComponent } from "./groups-main-component";
import { Loading } from "@/components/loading";

export default async function GroupsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GroupsMainComponent />
    </Suspense>
  );
}
