import { CertificationPrimitive } from "./certification-primitive";

export type CertificationType = "AWS" | "IPC" | "CUSTOM";

export interface Endorsement {
  id: string;
  name: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  certification_id: string;
  level?: string;
  certification_primitive: CertificationPrimitive;
  start_date: string;
  end_date: string;
  type: CertificationType;
  endorsements?: Endorsement[];
  is_active: boolean;
  // Timestamps
  created_at: string;
  updated_at: string;
}
