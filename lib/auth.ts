import { getUsers, saveUsers, User } from "./db";

export function register(name: string, email: string, password: string): boolean {
  const users = getUsers();
  if (users.some((u) => u.email === email)) return false;
  users.push({ name, email, password, role: "customer" });
  saveUsers(users);
  return true;
}

export function login(email: string, password: string): boolean {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (!user) return false;
  localStorage.setItem("currentUser", JSON.stringify(user));
  return true;
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem("currentUser");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function logout() {
  localStorage.removeItem("currentUser");
}