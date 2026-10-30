import { getCurrentUser } from "./auth";
import { getProducts } from "./db";

export type CartItem = { id: number; qty: number };

function cartKey(): string | null {
  const user = getCurrentUser();
  return user ? "cart_" + user.email : null;
}

export function getCart(): CartItem[] {
  const key = cartKey();
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key) || "[]") as CartItem[];
}

export function saveCart(cart: CartItem[]) {
  const key = cartKey();
  if (key) localStorage.setItem(key, JSON.stringify(cart));
}

// return false kalau belum login
export function addToCart(id: number): boolean {
  if (!cartKey()) return false;
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  return true;
}

export function removeFromCart(id: number) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function getCartTotal(): number {
  const products = getProducts();
  return getCart().reduce((sum, i) => {
    const p = products.find((p) => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}