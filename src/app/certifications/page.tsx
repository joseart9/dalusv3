import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { CertificationsView } from "./certifications-view";

export default async function Certifications() {
  return (
    <Suspense fallback={<Loading />}>
      <CertificationsView />
    </Suspense>
  );
}
