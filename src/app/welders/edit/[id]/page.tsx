import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { EditWelderContent } from "./EditWelderContent";

export default async function EditWelderPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={<Loading />}>
      <EditWelderContent id={params.id} />
    </Suspense>
  );
}
