/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRupiah } from "../../lib/db";
import type { Product } from "../../lib/db";
import { tx } from "../../lib/format";
import { getCart, setQty, removeFromCart, clearCart, getCartTotal } from "../../lib/cart";
import type { CartItem, TextMap } from "../../lib/types";
import SafeImg from "./SafeImg";
import AuthWarning from "./AuthWarning";
import { useAuth } from "./AuthProvider";

type CartViewProps = { texts: TextMap; fallbackImage: string };

export default function CartView({ texts, fallbackImage }: CartViewProps) {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  async function refresh() {
    const [res, c] = await Promise.all([fetch("/api/products"), getCart()]);
    const prods: Product[] = await res.json();
    setProducts(prods);
    setCart(c);
    setTotal(getCartTotal(c, prods));
  }

  useEffect(() => {
    if (!loading && user) refresh();
  }, [loading, user]);

  async function changeQty(id: number, delta: number) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    await setQty(id, Math.max(1, item.qty + delta));
    await refresh();
  }

  async function handleDelete(id: number) {
    await removeFromCart(id);
    await refresh();
  }

  async function handleCheckout() {
    if (cart.length === 0) return alert(tx(texts, "cart.checkoutEmpty"));
    alert(tx(texts, "cart.checkoutSuccess") + " " + formatRupiah(total));
    await clearCart();
    await refresh();
  }

  if (loading) return null;

  return (
    <main className="card wide">
      <h1>{tx(texts, "cart.title")}</h1>
      <div>
        {cart.length === 0 ? (
          <p>{tx(texts, "cart.empty")}</p>
        ) : (
          cart.map((i) => {
            const p = products.find((p) => p.id === i.id);
            if (!p) return null;
            return (
              <div className="cart-row" key={p.id}>
                <SafeImg src={p.img} alt={p.name} fallback={fallbackImage} />
                <div className="info">
                  <p>{p.name}</p>
                  <p>{formatRupiah(p.price)}</p>
                </div>
                <div className="qty">
                  <button onClick={() => changeQty(p.id, -1)}>-</button>
                  <span>{i.qty}</span>
                  <button onClick={() => changeQty(p.id, 1)}>+</button>
                </div>
                <button className="btn-del" onClick={() => handleDelete(p.id)}>{tx(texts, "cart.remove")}</button>
              </div>
            );
          })
        )}
      </div>
      <p className="total">{tx(texts, "cart.total")} <strong>{formatRupiah(total)}</strong></p>
      <button className="btn-add" onClick={handleCheckout}>{tx(texts, "cart.checkout")}</button>
      <p className="alt"><Link href="/store">{tx(texts, "cart.continue")}</Link></p>

      {!user && (
        <AuthWarning
          title={tx(texts, "store.auth.title")}
          message={tx(texts, "cart.needLogin")}
          buttonLabel={tx(texts, "store.auth.loginButton")}
        />
      )}
    </main>
  );
}