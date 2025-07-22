export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
  created_at: string;
  updated_at: string;
}
