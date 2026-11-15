import type { Product } from "./db";
import type { CartItem } from "./types";

const json = {
  "Content-Type": "application/json",
};

export type CartActionResult = {
  ok: boolean;
  status: number;
  message?: string;
};

async function getActionResult(
  res: Response
): Promise<CartActionResult> {
  const data = await res.json().catch(() => ({}));

  return {
    ok: res.ok,
    status: res.status,
    message: data.message,
  };
}

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch("/api/cart");

  return res.ok ? res.json() : [];
}

export async function addToCart(
  id: number
): Promise<CartActionResult> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ productId: id }),
  });

  return getActionResult(res);
}

export async function setQty(
  id: number,
  qty: number
): Promise<CartActionResult> {
  const res = await fetch("/api/cart", {
    method: "PATCH",
    headers: json,
    body: JSON.stringify({
      productId: id,
      qty,
    }),
  });

  return getActionResult(res);
}

export async function removeFromCart(id: number) {
  await fetch(`/api/cart?productId=${id}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  await fetch("/api/cart", {
    method: "DELETE",
  });
}

export function getCartTotal(
  cart: CartItem[],
  products: Product[]
): number {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);

    return sum + (
      product ? product.price * item.qty : 0
    );
  }, 0);
}