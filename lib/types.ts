export type Role = "admin" | "customer";

export type Session = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type CartItem = {
  id: number,
  qty: number
}