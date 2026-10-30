/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../lib/auth";
import { getProducts, formatRupiah, Product } from "../../../lib/db";
import {
  CartItem, getCart, saveCart, removeFromCart, getCartTotal,
} from "../../../lib/cart";
import SafeImg from "../../../components/store/SafeImg";
import AuthWarning from "../../../components/store/AuthWarning";

export default function CartPage() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  function refresh() {
    setProducts(getProducts());
    setCart(getCart());
    setTotal(getCartTotal());
  }

  useEffect(() => {
    setLoggedIn(getCurrentUser() !== null);
    refresh();
    setReady(true);
  }, []);

  function changeQty(id: number, delta: number) {
    const c = getCart();
    const item = c.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(c);
    refresh();
  }

  function handleDelete(id: number) {
    removeFromCart(id);
    refresh();
  }

  function handleCheckout() {
    if (getCart().length === 0) return alert("Keranjang masih kosong.");
    alert("Pesanan berhasil dibuat! Total: " + formatRupiah(getCartTotal()));
    saveCart([]);
    refresh();
  }

  if (!ready) return null;

  return (
    <main className="card wide">
      <h1>Keranjang</h1>
      <div>
        {cart.length === 0 ? (
          <p>Keranjang kosong. Pilih rendang dulu di halaman utama.</p>
        ) : (
          cart.map((i) => {
            const p = products.find((p) => p.id === i.id);
            if (!p) return null; // produk sudah dihapus admin
            return (
              <div className="cart-row" key={p.id}>
                <SafeImg src={p.img} alt={p.name} />
                <div className="info">
                  <p>{p.name}</p>
                  <p>{formatRupiah(p.price)}</p>
                </div>
                <div className="qty">
                  <button onClick={() => changeQty(p.id, -1)}>-</button>
                  <span>{i.qty}</span>
                  <button onClick={() => changeQty(p.id, 1)}>+</button>
                </div>
                <button className="btn-del" onClick={() => handleDelete(p.id)}>Hapus</button>
              </div>
            );
          })
        )}
      </div>
      <p className="total">Total: <strong>{formatRupiah(total)}</strong></p>
      <button className="btn-add" onClick={handleCheckout}>Checkout</button>
      <p className="alt"><Link href="/store/store">Lanjut belanja</Link></p>

      {!loggedIn && (
        <AuthWarning message="Silakan masuk (login) terlebih dahulu untuk melihat keranjang belanja Anda." />
      )}
    </main>
  );
}