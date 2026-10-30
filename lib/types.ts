export type Role = "admin" | "customer";

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
};

export type User = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type CartItem = {
  id: number;
  qty: number;
};

export type LoginResult = "ok" | "not_found" | "wrong_password";