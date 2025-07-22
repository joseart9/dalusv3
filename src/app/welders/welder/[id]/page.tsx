import { MainView } from "./main-view";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

export default async function WelderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <MainView id={id} />
    </Suspense>
  );
}
