/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, formatRupiah, Product } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/auth";
import { addToCart } from "../../../lib/cart";
import SafeImg from "../../../components/store/SafeImg";
import AuthWarning from "../../../components/store/AuthWarning";
import CartNotification, { NotifPos } from "../../../components/store/CartNotification";

export default function TokoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [notif, setNotif] = useState<NotifPos | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setLoggedIn(getCurrentUser() !== null);
  }, []);

  const list = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    if (!addToCart(id)) {
      setShowWarning(true);
      return;
    }
    const pos: NotifPos = {};
    if (window.innerWidth >= 1024) {
      const r = e.currentTarget.getBoundingClientRect();
      pos.left = r.right + window.scrollX + 15;
      pos.top = r.top + window.scrollY + r.height / 2;
    }
    setNotif(pos);
  }

  return (
    <>
      <section id="header-hero">
        <div id="intro">
          <h1>TOKO RENDANG</h1>
        </div>

        <div id="navigation">
          <nav>
            <Link href="/">Home</Link>
            <a href="#jendang">Lists</a>
            <a href="#contact">Contact</a>
            <Link href="/cart">Keranjang</Link>
            {loggedIn ? (
              <Link href="/acc">Akun</Link>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </nav>
        </div>

        <div id="hero-image">
          <img src="/Photos/rendang-hero.jpg" alt="Rendang" className="hero-img" />
        </div>
      </section>

      <section>
        <div id="jendang">
          <h1 className="section-title1">Jenis Rendang</h1>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Cari jenis rendang"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div id="renlistcontToko">
            {list.length === 0 ? (
              <p>Rendang tidak ditemukan.</p>
            ) : (
              list.map((p) => (
                <div className="renlist" key={p.id}>
                  <SafeImg src={p.img} alt={p.name} />
                  <div>
                    <p>{p.name}</p>
                    <p>{formatRupiah(p.price)}</p>
                    <button className="btn-add" onClick={(e) => handleAdd(e, p.id)}>
                      + Keranjang
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <footer id="contact">
        <h2>Contact</h2>
        <div className="footer">
          <p>Kunjungi instagram kami!</p>
          <p>Kritik dan saran? Silakan hubungi email kami: example@email.com</p>
        </div>
      </footer>

      {notif && <CartNotification pos={notif} onClose={() => setNotif(null)} />}
      {showWarning && (
        <AuthWarning message="Silakan masuk (login) terlebih dahulu untuk menambahkan ke keranjang." />
      )}
    </>
  );
}