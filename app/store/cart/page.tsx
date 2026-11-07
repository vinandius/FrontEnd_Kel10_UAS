/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRupiah, Product } from "../../../lib/db";
import { getCart, setQty, removeFromCart, clearCart, getCartTotal} from "../../../lib/cart";
import SafeImg from "../../../components/store/SafeImg";
import AuthWarning from "../../../components/store/AuthWarning";
import { useAuth } from "@/components/store/AuthProvider";
import { CartItem } from "../../../lib/types";

export default function CartPage() {
  const { user, loading } = useAuth();
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ cart, setCart ] = useState<CartItem[]>([]);
  const [ total, setTotal] = useState(0);

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
    if (cart.length === 0) return alert("Keranjang masih kosong.");
    alert("Pesanan berhasil dibuat! Total: " + formatRupiah(total));
    await clearCart();
    await refresh();
  }

  if (loading) return null;

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

      {!user && (
        <AuthWarning message="Silakan masuk (login) terlebih dahulu untuk melihat keranjang belanja Anda." />
      )}
    </main>
  );
}