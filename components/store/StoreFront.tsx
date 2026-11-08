/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { formatRupiah } from "../../lib/db";
import type { Product } from "../../lib/db";
import { tx } from "../../lib/format";
import { addToCart } from "../../lib/cart";
import type { FooterData, NavItem, TextMap } from "../../lib/types";
import SafeImg from "./SafeImg";
import AuthWarning from "./AuthWarning";
import CartNotification, { NotifPos } from "./CartNotification";
import TokoNav from "./TokoNav";
import StoreFooter from "./StoreFooter";

type StoreFrontProps = {
  hero: { title: string; imageUrl: string; imageAlt: string };
  navLinks: NavItem[];
  products: Product[];
  texts: TextMap;
  footer: FooterData;
  fallbackImage: string;
};

export default function StoreFront({ hero, navLinks, products, texts, footer, fallbackImage }: StoreFrontProps) {
  const [keyword, setKeyword] = useState("");
  const [notif, setNotif] = useState<NotifPos | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const list = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    const btn = e.currentTarget;
    const ok = await addToCart(id);
    if (!ok) {
      setShowWarning(true);
      return;
    }
    const pos: NotifPos = {};
    if (window.innerWidth >= 1024) {
      const r = btn.getBoundingClientRect();
      pos.left = r.right + window.scrollX + 15;
      pos.top = r.top + window.scrollY + r.height / 2;
    }
    setNotif(pos);
  }

  return (
    <>
      <section id="header-hero">
        <div id="intro">
          <h1>{hero.title}</h1>
        </div>

        <TokoNav links={navLinks} />

        <div id="hero-image">
          <img src={hero.imageUrl} alt={hero.imageAlt} className="hero-img" />
        </div>
      </section>

      <section>
        <div id="jendang">
          <h1 className="section-title1">{tx(texts, "store.list.title")}</h1>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder={tx(texts, "store.search.placeholder")}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div id="renlistcontToko">
            {list.length === 0 ? (
              <p>{tx(texts, "store.empty")}</p>
            ) : (
              list.map((p) => (
                <div className="renlist" key={p.id}>
                  <SafeImg src={p.img} alt={p.name} fallback={fallbackImage} />
                  <div>
                    <p>{p.name}</p>
                    <p>{formatRupiah(p.price)}</p>
                    <button className="btn-add" onClick={(e) => handleAdd(e, p.id)}>
                      {tx(texts, "store.addToCart")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <StoreFooter footer={footer} />

      {notif && (
        <CartNotification pos={notif} message={tx(texts, "store.notif.added")} onClose={() => setNotif(null)} />
      )}
      {showWarning && (
        <AuthWarning
          title={tx(texts, "store.auth.title")}
          message={tx(texts, "store.auth.needLoginAdd")}
          buttonLabel={tx(texts, "store.auth.loginButton")}
        />
      )}
    </>
  );
}