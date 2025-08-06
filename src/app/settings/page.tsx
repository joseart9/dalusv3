import { MainView } from "./main-view/main-view";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

export default async function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MainView />
    </Suspense>
  );
}
