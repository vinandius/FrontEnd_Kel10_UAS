/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "../../../lib/auth";
import { formatRupiah, Product } from "../../../lib/db";
import { readImage } from "../../../lib/image";
import SafeImg from "../../../components/store/SafeImg";
import { useAuth } from "../../../components/store/AuthProvider";
import ContentManager from "../../../components/store/ContentManager";

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [tab, setTab] = useState<"produk" | "konten" | "riwayat" | "ringkasan">("produk");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const { user, loading, refresh } = useAuth();
  const allowed = user?.role === "admin";

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      router.replace("/store/login");
      return;
    }
    loadProducts();
  }, [loading, user, router]);

  function resetForm() {
    setEditId(null);
    setName("");
    setPrice("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function loadProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  async function loadPurchases() {
    const res = await fetch("/api/admin/purchases");
    if (res.ok) setPurchases(await res.json());
  }

  async function loadSummary() {
    const res = await fetch("/api/admin/sales-summary");
    if (res.ok) setSummary(await res.json());
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    const priceNum = Number(price);
    const file = fileRef.current?.files?.[0];

    if (priceNum <= 0) return alert("Harga harus lebih dari 0.");

    if (editId !== null) {
      const p = products.find((p) => p.id === editId)!;
      if (p.name === trimmed && p.price === priceNum && !file) {
        return alert("Tidak ada perubahan.");
      }
      let pesan =
        "Simpan perubahan?\n\n" +
        "Nama: " + p.name + " -> " + trimmed + "\n" +
        "Harga: " + formatRupiah(p.price) + " -> " + formatRupiah(priceNum) +
        (file ? "\nFoto: diganti" : "");
      const rasio = priceNum / p.price;
      if (rasio < 0.5 || rasio > 2) {
        pesan += "\n\nPERHATIAN: harga berubah drastis. Pastikan angkanya sudah benar.";
      }
      if (!confirm(pesan)) return;
    } else if (!confirm('Tambah produk "' + trimmed + '" dengan harga ' + formatRupiah(priceNum) + "?")) {
      return;
    }

    let img: string | null = null;
    if (file) {
      try {
        img = await readImage(file);
      } catch {
        return alert("File yang dipilih bukan gambar yang valid.");
      }
    }

    const res = await fetch(
      editId !== null ? `/api/products/${editId}` : "/api/products",
      {
        method: editId !== null ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, price: priceNum, img }),
      }
    );
    if (!res.ok) return alert("Gagal menyimpan produk.");
      await loadProducts();
      resetForm();
  }

  function handleEdit(p: Product) {
    setEditId(p.id);
    setName(p.name);
    setPrice(String(p.price));
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await loadProducts();
  }

  if (!allowed) return null;

  return (
    <main className="card wide">
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button className="btn-add" style={{ opacity: tab === "produk" ? 1 : 0.5 }} onClick={() => setTab("produk")}>Produk</button>
        <button className="btn-add" style={{ opacity: tab === "konten" ? 1 : 0.5 }} onClick={() => setTab("konten")}>Konten Situs</button>
        <button className="btn-add" style={{ opacity: tab === "riwayat" ? 1 : 0.5 }} onClick={() => { setTab("riwayat"); loadPurchases(); }}>Riwayat Pembelian</button>
        <button className="btn-add" style={{ opacity: tab === "ringkasan" ? 1 : 0.5 }} onClick={() => { setTab("ringkasan"); loadSummary(); }}>Ringkasan Hari Ini</button>
      </div>

      {tab === "konten" && <ContentManager />}

      {tab === "riwayat" && (
        <>
          <h1>Riwayat Pembelian</h1>
          {purchases.length === 0 ? <p>Belum ada pembelian.</p> : (
            <table>
              <thead><tr><th>ID</th><th>Pembeli</th><th>Produk</th><th>Total</th><th>Waktu</th></tr></thead>
              <tbody>{purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>#{purchase.id}</td>
                  <td>{purchase.user.name}<br /><small>{purchase.user.email}</small></td>
                  <td>{purchase.items.map((item) => <div key={item.id}>{item.productName} × {item.qty}</div>)}</td>
                  <td>{formatRupiah(purchase.total)}</td>
                  <td>{new Date(purchase.createdAt).toLocaleString("id-ID")}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </>
      )}

      {tab === "ringkasan" && (
        <>
          <h1>Ringkasan Penjualan Hari Ini</h1>
          <button className="btn-add" onClick={loadSummary}>Perbarui Ringkasan</button>
          {summary && <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
            <p><strong>Jumlah transaksi:</strong> {summary.transactionCount}</p>
            <p><strong>Produk terjual:</strong> {summary.itemCount}</p>
            <p><strong>Total penjualan:</strong> {formatRupiah(summary.totalRevenue)}</p>
            <small>Ringkasan diperbarui: {new Date(summary.updatedAt).toLocaleString("id-ID")}</small>
            <h2>Produk yang Terjual Hari Ini</h2>
            {summary.products.length === 0 ? <p>Belum ada produk yang terjual hari ini.</p> : (
              <table>
                <thead><tr><th>Produk</th><th>Jumlah</th><th>Total Penjualan</th></tr></thead>
                <tbody>{summary.products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productName}</td>
                    <td>{product.qty}</td>
                    <td>{formatRupiah(product.revenue)}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>}
        </>
      )}

      {tab === "produk" && (
        <>
          <h1>Kelola Produk</h1>
          <form className="admin-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Nama rendang" required value={name}
              onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Harga (Rp)" min={0} required value={price}
              onChange={(e) => setPrice(e.target.value)} />
            <label className="file-label">
              Foto produk (kosongkan jika tidak ingin mengganti)
              <input type="file" accept="image/*" ref={fileRef} />
            </label>
            <button type="submit" className="btn-add" id="saveBtn">
              {editId !== null ? "Simpan perubahan" : "Tambah produk"}
            </button>
            {editId !== null && (
              <button type="button" className="btn-del" id="cancelBtn" onClick={resetForm}>
                Batal
              </button>
            )}
          </form>

          <table>
            <thead>
              <tr><th>Foto</th><th>Nama</th><th>Harga</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><SafeImg src={p.img} className="thumb" /></td>
                  <td>{p.name}</td>
                  <td>{formatRupiah(p.price)}</td>
                  <td>
                    <button className="btn-add" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn-del" onClick={() => handleDelete(p.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <p className="alt">
        <Link href="/store">Kembali ke toko</Link> |{" "}
        <a href="#" onClick={ async (e) => { e.preventDefault(); await logout(); await refresh(); router.push("/store/login"); }}>
          Keluar (log out)
        </a>
      </p>
    </main>
  );
}

type Purchase = {
  id: number;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  items: { id: number; productName: string; qty: number }[];
};

type SalesSummary = {
  transactionCount: number;
  itemCount: number;
  totalRevenue: number;
  updatedAt: string;
  products: { productId: number; productName: string; qty: number; revenue: number }[];
};