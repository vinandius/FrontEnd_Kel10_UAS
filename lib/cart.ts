import type { Product } from "./db";
import type { CartItem } from "./types";

const json = {"Content-Type": "application/json"};

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch("/api/cart");
  return res.ok?res.json(): [];
}

export async function addToCart(id: number): Promise<boolean> {
  const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({ productId: id })});
  return res.ok;
}

export async function setQty(id: number, qty:number) {
  await fetch("/api/cart", {
    method: "PATCH", headers:json, body:JSON.stringify({ productId: id, qty}),
  });
}

export async function removeFromCart(id: number) {
  await fetch(`/api/cart?productId=${id}`, { method:"DELETE" });
}

export async function clearCart() {
  await fetch("/api/cart", { method:"DELETE" });
}

export function getCartTotal(cart: CartItem[], products: Product[]): number {
  return cart.reduce((sum, i) => {
    const p = products.find((p) => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}