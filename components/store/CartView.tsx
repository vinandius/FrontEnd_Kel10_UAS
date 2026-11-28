/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRupiah } from "../../lib/db";
import type { Product } from "../../lib/db";
import { tx } from "../../lib/format";
import {
  getCart,
  setQty,
  removeFromCart,
  getCartTotal,
} from "../../lib/cart";
import type { CartItem, TextMap } from "../../lib/types";
import SafeImg from "./SafeImg";
import AuthWarning from "./AuthWarning";
import { useAuth } from "./AuthProvider";

type CartViewProps = {
  texts: TextMap;
  fallbackImage: string;
};

function countWords(value: string): number {
  const trimmed = value.trim();

  if (!trimmed) return 0;

  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function CartView({
  texts,
  fallbackImage,
}: CartViewProps) {
  const { user, loading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const noteWords = countWords(note);
  const noteTooLong = noteWords > 20;

  async function refresh() {
    const [res, cartItems] = await Promise.all([
      fetch("/api/products"),
      getCart(),
    ]);

    if (!res.ok) return;

    const productList: Product[] = await res.json();

    setProducts(productList);
    setCart(cartItems);
    setTotal(getCartTotal(cartItems, productList));
  }

  useEffect(() => {
    if (!loading && user) {
      refresh();
    }
  }, [loading, user]);

  async function changeQty(id: number, delta: number) {
    const item = cart.find((i) => i.id === id);

    if (!item) return;

    const result = await setQty(
      id,
      Math.max(1, item.qty + delta)
    );

    if (!result.ok) {
      setCheckoutMessage(
        result.message ?? "Gagal mengubah jumlah barang."
      );
      return;
    }

    setCheckoutMessage("");
    await refresh();
  }

  async function handleDelete(id: number) {
    await removeFromCart(id);
    await refresh();
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      setCheckoutMessage(
        tx(texts, "cart.checkoutEmpty")
      );
      return;
    }

    if (noteTooLong) {
      setCheckoutMessage(
        tx(texts, "cart.note.limit")
      );
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));

      setCheckoutMessage(
        data.message ?? "Checkout gagal disimpan."
      );

      await refresh();
      return;
    }

    const data = await res.json();
    setReceipt(data);
    setNote("");
    setCheckoutMessage("");
    await refresh();

    window.dispatchEvent(new Event("cart-updated"));
  }

  if (loading) return null;

  return (
    <main className="card wide">
      <h1>{tx(texts, "cart.title")}</h1>

      <div>
        {cart.length === 0 ? (
          <p>{tx(texts, "cart.empty")}</p>
        ) : (
          cart.map((item) => {
            const product = products.find(
              (p) => p.id === item.id
            );

            if (!product) return null;

            return (
              <div className="cart-row" key={product.id}>
                <SafeImg
                  src={product.img}
                  alt={product.name}
                  fallback={fallbackImage}
                />

                <div className="info">
                  <p>{product.name}</p>
                  <p>{formatRupiah(product.price)}</p>

                  <small className="product-stock">
                    Stok tersedia: {product.stock}
                  </small>
                </div>

                <div className="qty">
                  <button
                    type="button"
                    onClick={() => changeQty(product.id, -1)}
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    type="button"
                    disabled={item.qty >= product.stock}
                    onClick={() => changeQty(product.id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn-del"
                  onClick={() => handleDelete(product.id)}
                >
                  {tx(texts, "cart.remove")}
                </button>
              </div>
            );
          })
        )}
      </div>

      <section className="cart-note">
        <label htmlFor="orderNote">
          {tx(texts, "cart.note.title")}
        </label>

        <textarea
          id="orderNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={tx(texts, "cart.note.placeholder")}
          rows={3}
        />

        <div className="note-counter">
          <span>{noteWords}/20 kata</span>

          {noteTooLong && (
            <span className="stock-out">
              {tx(texts, "cart.note.limit")}
            </span>
          )}
        </div>
      </section>

      <p className="total">
        {tx(texts, "cart.total")}{" "}
        <strong>{formatRupiah(total)}</strong>
      </p>

      <button
        className="btn-add"
        onClick={handleCheckout}
        disabled={cart.length === 0 || noteTooLong}
      >
        {tx(texts, "cart.checkout")}
      </button>

      {checkoutMessage && (
        <div className="checkout-alert" role="status">
          <span>{checkoutMessage}</span>

          <button
            type="button"
            onClick={() => setCheckoutMessage("")}
            aria-label="Tutup notifikasi"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Receipt */}
      {receipt && (
        <div className="receipt">
          <h2>Receipt Pesanan</h2>

          <p>Nomor pesanan: #{receipt.id}</p>

          <hr />

          {receipt.items.map((item: any, index: number) => (
              <p key={index}>
                  {item.productName} × {item.qty}
                  {" — "}
                  {formatRupiah(item.price * item.qty)}
              </p>
          ))}

          <hr />

          <h3>
              Total: {formatRupiah(receipt.total)}
          </h3>

          <button type="button" className="btn-add" onClick={() => setReceipt(null)}>
              Tutup
          </button>
      </div>
    )}

      <p className="alt">
        <Link href="/store">
          {tx(texts, "cart.continue")}
        </Link>
      </p>

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