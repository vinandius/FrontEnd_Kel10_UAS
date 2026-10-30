/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser, logout } from "../../../lib/auth";
import { getProducts, saveProducts, formatRupiah, Product } from "../../../lib/db";
import { readImage } from "../../../lib/image";
import SafeImg from "../../../components/store/SafeImg";

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
      router.replace("/login");
      return;
    }
    setProducts(getProducts());
    setAllowed(true);
  }, [router]);

  function resetForm() {
    setEditId(null);
    setName("");
    setPrice("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const list = getProducts();
    const trimmed = name.trim();
    const priceNum = Number(price);
    const file = fileRef.current?.files?.[0];

    if (priceNum <= 0) return alert("Harga harus lebih dari 0.");

    if (editId !== null) {
      const p = list.find((p) => p.id === editId)!;
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

    if (editId !== null) {
      const p = list.find((p) => p.id === editId)!;
      p.name = trimmed;
      p.price = priceNum;
      if (img) p.img = img;
    } else {
      const newId = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
      list.push({ id: newId, name: trimmed, price: priceNum, img: img || "/Photos/Rendang.jpg" });
    }

    if (saveProducts(list)) {
      setProducts(list);
      resetForm();
    }
  }

  function handleEdit(p: Product) {
    setEditId(p.id);
    setName(p.name);
    setPrice(String(p.price));
  }

  function handleDelete(id: number) {
    if (!confirm("Hapus produk ini?")) return;
    const list = getProducts().filter((p) => p.id !== id);
    saveProducts(list);
    setProducts(list);
  }

  if (!allowed) return null;

  return (
    <main className="card wide">
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

      <p className="alt">
        <Link href="/store">Lihat toko</Link> |{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); router.push("/store/login"); }}>
          Keluar
        </a>
      </p>
    </main>
  );
}