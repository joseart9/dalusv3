import { Address } from "./address";
import { Group } from "./group";
import { Certification, Endorsement } from "./certification";

export interface Welder {
  id: string;
  // Personal Information
  first_name: string;
  middle_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  email: string;
  secondary_email: string;
  phone: string;
  address: Address;
  // Dalus required fields
  groups: Group[];
  welder_id?: string;
  certifications: Certification[];
  endorsements: Endorsement[];
  // Logic fields
  is_active: boolean;
  is_deleted: boolean;
  is_in_waiting_list: boolean;
  // Timestamps
  created_at: string;
  updated_at: string;
}
