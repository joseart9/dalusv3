import { CertificationsMainView } from "./certifications-main-view";
import { getCertifications } from "@/server/services/certifications";

export async function CertificationsView() {
  const certifications = await getCertifications();
  return <CertificationsMainView certifications={certifications} />;
}
