export type Role = "admin" | "customer";

export type Session = {
  userId: number;
  name: string;
  email: string;
  role: Role;
};