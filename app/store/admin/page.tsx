 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "../../../lib/auth";
import { formatRupiah, Product, Category, Tag } from "../../../lib/db";
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
  const [stock, setStock] = useState("0");
  const [maxStock, setMaxStock] = useState("50");

  const [restockProductId, setRestockProductId] = useState<number | null>(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockError, setRestockError] = useState("");
  const [restocking, setRestocking] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);

  const [tab, setTab] = useState<"produk" | "konten" | "riwayat" | "ringkasan">("produk");

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sortKey, setSortKey] = useState<"id" | "total" | "createdAt" | "pembeli" | "produk" | "status">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [summary, setSummary] = useState<SalesSummary | null>(null);

  const { user, loading, refresh } = useAuth();
  const allowed = user?.role === "admin";

  // Memeriksa hak akses admin
  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      router.replace("/store/login");
      return;
    }

    loadProducts();
  }, [loading, user, router]);

  // Mengosongkan form
  function resetForm() {
    setEditId(null);
    setName("");
    setPrice("");
    setStock("0");
    setMaxStock("50");
    setCategoryId("");
    setTagIds([]);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  // Mengambil data produk, kategori, dan tag
  async function loadProducts() {
    const res = await fetch("/api/products");

    if (res.ok) {
      setProducts(await res.json());
    }

    const [c, t] = await Promise.all([
      fetch("/api/admin/content/category"),
      fetch("/api/admin/content/tag"),
    ]);

    if (c.ok) {
      setCategories((await c.json()).rows);
    }

    if (t.ok) {
      setAllTags((await t.json()).rows);
    }
  }

  // Mengambil riwayat pembelian
  async function loadPurchases() {
    const res = await fetch("/api/admin/purchases");

    if (res.ok) {
      setPurchases(await res.json());
    }
  }

  // Mengubah status pesanan
  async function updatePurchaseStatus(id: number, status: string) {
    const res = await fetch("/api/admin/purchases", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.message ?? "Gagal mengubah status pesanan.");
      await loadPurchases();
      return;
    }

    await loadPurchases();
  }

  // Mengambil ringkasan penjualan
  async function loadSummary() {
    const res = await fetch("/api/admin/sales-summary");

    if (res.ok) {
      setSummary(await res.json());
    }
  }

  // Menambahkan atau mengedit produk
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = name.trim();
    const priceNum = Number(price);
    const stockNum = Number(stock);
    const maxStockNum = Number(maxStock);

    const file = fileRef.current?.files?.[0];

    if (!trimmed) {
      return alert("Nama produk wajib diisi.");
    }

    if (!Number.isInteger(priceNum) || priceNum <= 0) {
      return alert("Harga harus berupa bilangan bulat lebih dari 0.");
    }

    if (
      !Number.isInteger(stockNum) ||
      !Number.isInteger(maxStockNum) ||
      stockNum < 0 ||
      maxStockNum < 0 ||
      stockNum > maxStockNum
    ) {
      return alert(
        "Stok tidak valid atau melebihi kapasitas maksimal."
      );
    }

    // Pemeriksaan ketika sedang mengedit produk
    if (editId !== null) {
      const p = products.find((p) => p.id === editId);

      if (!p) return;

      const sameTags =
        p.tags.map((t) => t.id).sort().join() ===
        [...tagIds].sort().join();

      const sameCategory =
        String(p.categoryId ?? "") === categoryId;

      const sameStock = p.stock === stockNum;
      const sameMaxStock = p.maxStock === maxStockNum;

      if (
        p.name === trimmed &&
        p.price === priceNum &&
        !file &&
        sameTags &&
        sameCategory &&
        sameStock &&
        sameMaxStock
      ) {
        return alert("Tidak ada perubahan.");
      }

      const pesan =
        "Simpan perubahan?\n\n" +
        "Nama: " + p.name + " -> " + trimmed + "\n" +
        "Harga: " + formatRupiah(p.price) +
        " -> " + formatRupiah(priceNum) + "\n" +
        "Stok: " + p.stock + " -> " + stockNum + "\n" +
        "Kapasitas: " + p.maxStock + " -> " + maxStockNum +
        (file ? "\nFoto: diganti" : "") +
        (!sameCategory || !sameTags
          ? "\nKategori/tag: diubah"
          : "");

      if (!confirm(pesan)) return;
    } else {
      // Konfirmasi penambahan produk baru
      if (
        !confirm(
          `Tambah produk "${trimmed}" dengan harga ${formatRupiah(priceNum)}?`
        )
      ) {
        return;
      }
    }

    // Membaca gambar jika ada file baru
    let img: string | null = null;

    if (file) {
      try {
        img = await readImage(file);
      } catch {
        return alert("File yang dipilih bukan gambar valid.");
      }
    }

    // Mengirim data ke API
    const res = await fetch(
      editId !== null
        ? `/api/products/${editId}`
        : "/api/products",
      {
        method: editId !== null ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmed,
          price: priceNum,
          img,
          categoryId,
          tagIds,
          stock: stockNum,
          maxStock: maxStockNum,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return alert(data.message ?? "Gagal menyimpan produk.");
    }

    alert(
      editId !== null
        ? "Produk berhasil diperbarui."
        : "Produk berhasil ditambahkan."
    );

    await loadProducts();
    resetForm();
  }

  // Mengisi form berdasarkan produk yang dipilih
  function handleEdit(p: Product) {
    setEditId(p.id);
    setName(p.name);
    setPrice(String(p.price));
    setStock(String(p.stock));
    setMaxStock(String(p.maxStock));
    setCategoryId(String(p.categoryId ?? ""));
    setTagIds(p.tags.map((t) => t.id));

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  // Menghapus produk
  async function handleDelete(id: number) {
    if (!confirm("Hapus produk ini?")) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return alert(data.message ?? "Gagal menghapus produk.");
    }

    await loadProducts();

    if (editId === id) {
      resetForm();
    }
  }

  // Membuka modal refill stok
  function handleRestock(id: number) {
    const product = products.find((p) => p.id === id);

    if (!product) {
      return alert("Produk tidak ditemukan.");
    }

    const remaining = product.maxStock - product.stock;

    if (remaining <= 0) {
      return alert("Stok sudah mencapai kapasitas maksimal.");
    }

    setRestockProductId(id);
    setRestockQuantity("");
    setRestockError("");
  }

  // Menutup modal refill
  function closeRestockModal() {
    if (restocking) return;

    setRestockProductId(null);
    setRestockQuantity("");
    setRestockError("");
  }

  // Menyimpan refill stok ke database
  async function submitRestock(e: React.FormEvent) {
    e.preventDefault();

    if (restockProductId === null) return;

    const product = products.find(
      (p) => p.id === restockProductId
    );

    if (!product) {
      setRestockError("Produk tidak ditemukan.");
      return;
    }

    const quantity = Number(restockQuantity);
    const remaining = product.maxStock - product.stock;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setRestockError(
        "Jumlah refill harus berupa bilangan bulat positif."
      );
      return;
    }

    if (quantity > remaining) {
      setRestockError(
        `Kapasitas tersisa hanya ${remaining} produk.`
      );
      return;
    }

    setRestocking(true);
    setRestockError("");

    try {
      const res = await fetch(
        `/api/products/${restockProductId}/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRestockError(
          data.message ?? "Gagal melakukan refill."
        );
        return;
      }

      alert(
        `Refill berhasil! Stok sekarang: ${data.product.stock}`
      );

      setRestockProductId(null);
      setRestockQuantity("");
      setRestockError("");

      await loadProducts();
    } catch (error) {
      console.error("Restock error:", error);

      setRestockError(
        "Terjadi kesalahan saat menghubungi server."
      );
    } finally {
      setRestocking(false);
    }
  }

  // Mengubah tab halaman admin
  function changeTab(
    selected: "produk" | "konten" | "riwayat" | "ringkasan"
  ) {
    setTab(selected);

    if (selected === "riwayat") {
      loadPurchases();
    }

    if (selected === "ringkasan") {
      loadSummary();
    }
  }

  // Mengganti kolom/arah urutan saat header tabel diklik
  function handleSort(key: "id" | "total" | "createdAt" | "pembeli" | "produk" | "status") {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");   // klik kolom yang sama → balik arah
    } else {
      setSortKey(key);
      setSortDir("asc");                                 // klik kolom baru → mulai dari naik
    }
  }

  // Data hasil sortir, dihitung ulang tiap render berdasarkan purchases+sortKey+sortDir
  const sortedPurchases = [...purchases].sort((a, b) => {
    let result = 0;

    if (sortKey === "id") result = a.id - b.id;
    if (sortKey === "total") result = a.total - b.total;
    if (sortKey === "createdAt") result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortKey === "pembeli") result = a.user.name.localeCompare(b.user.name);
    if (sortKey === "produk") {
      const totalQtyA = a.items.reduce((s, i) => s + i.qty, 0);
      const totalQtyB = b.items.reduce((s, i) => s + i.qty, 0);
      result = totalQtyA - totalQtyB;
    }
    if (sortKey === "status") {
      result = a.status.localeCompare(b.status);
    }
    return sortDir === "asc" ? result : -result;
  });

  const restockProduct = products.find(
    (p) => p.id === restockProductId
  ) ?? null;

  if (!allowed) return null;

  return (
    <main className="card wide">

      {/* Navigasi tab admin */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn-add"
          style={{ opacity: tab === "produk" ? 1 : 0.5 }}
          onClick={() => changeTab("produk")}
        >
          Produk
        </button>

        <button
          type="button"
          className="btn-add"
          style={{ opacity: tab === "konten" ? 1 : 0.5 }}
          onClick={() => changeTab("konten")}
        >
          Konten Situs
        </button>

        <button
          type="button"
          className="btn-add"
          style={{ opacity: tab === "riwayat" ? 1 : 0.5 }}
          onClick={() => changeTab("riwayat")}
        >
          Riwayat Pembelian
        </button>

        <button
          type="button"
          className="btn-add"
          style={{ opacity: tab === "ringkasan" ? 1 : 0.5 }}
          onClick={() => changeTab("ringkasan")}
        >
          Ringkasan Hari Ini
        </button>
      </div>

      {/* TAB KONTEN SITUS */}
      {tab === "konten" && <ContentManager />}

      {/* TAB RIWAYAT PEMBELIAN */}
      {tab === "riwayat" && (
        <>
          <h1>Riwayat Pembelian</h1>

          {purchases.length === 0 ? (
            <p>Belum ada pembelian.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                    ID {sortKey === "id" ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th onClick={() => handleSort("pembeli")} style={{ cursor: "pointer" }}>
                    Pembeli {sortKey === "pembeli" ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th onClick={() => handleSort("produk")} style={{ cursor: "pointer" }}>
                    Produk {sortKey === "produk" ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th onClick={() => handleSort("total")} style={{ cursor: "pointer" }}>
                    Total {sortKey === "total" ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th>Catatan</th>
                  <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                    Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                    Waktu {sortKey === "createdAt" ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>#{purchase.id}</td>

                    <td>
                      {purchase.user.name}
                      <br />
                      <small>{purchase.user.email}</small>
                    </td>

                    <td>
                      {purchase.items.map((item) => (
                        <div key={item.id}>
                          {item.productName} × {item.qty}
                        </div>
                      ))}
                    </td>

                    <td>{formatRupiah(purchase.total)}</td>

                    <td>{purchase.note || "-"}</td>

                    <td>
                      <select
                        value={purchase.status}
                        disabled={purchase.status === "COMPLETED"}
                        onChange={(e) =>
                          updatePurchaseStatus(
                            purchase.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="PENDING">Menunggu</option>
                        <option value="PROCESSING">Diproses</option>
                        <option value="COMPLETED">Selesai</option>
                      </select>
                    </td>

                    <td>
                      {new Date(
                        purchase.createdAt
                      ).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* TAB RINGKASAN PENJUALAN */}
      {tab === "ringkasan" && (
        <>
          <h1>Ringkasan Penjualan Hari Ini</h1>

          <button
            type="button"
            className="btn-add"
            onClick={loadSummary}
          >
            Perbarui Ringkasan
          </button>

          {summary && (
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              <p>
                <strong>Jumlah transaksi:</strong>{" "}
                {summary.transactionCount}
              </p>

              <p>
                <strong>Produk terjual:</strong>{" "}
                {summary.itemCount}
              </p>

              <p>
                <strong>Total penjualan:</strong>{" "}
                {formatRupiah(summary.totalRevenue)}
              </p>

              <small>
                Ringkasan diperbarui:{" "}
                {new Date(summary.updatedAt).toLocaleString("id-ID")}
              </small>

              <h2>Produk yang Terjual Hari Ini</h2>

              {summary.products.length === 0 ? (
                <p>Belum ada produk yang terjual hari ini.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Jumlah</th>
                      <th>Total Penjualan</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.products.map((product) => (
                      <tr key={product.productId}>
                        <td>{product.productName}</td>
                        <td>{product.qty}</td>
                        <td>{formatRupiah(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {/* TAB KELOLA PRODUK */}
      {tab === "produk" && (
        <>
          <h1>Kelola Produk</h1>

          {/* Form tambah dan edit produk */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama produk"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Harga (Rp)"
              min={1}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Stok awal / stok saat ini"
              min={0}
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <input
              type="number"
              placeholder="Kapasitas maksimal stok"
              min={0}
              required
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- kategori --</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Pilihan tag */}
            <div>
              {allTags.map((t) => (
                <label key={t.id} style={{ marginRight: 10 }}>
                  <input
                    type="checkbox"
                    checked={tagIds.includes(t.id)}
                    onChange={() =>
                      setTagIds(
                        tagIds.includes(t.id)
                          ? tagIds.filter((x) => x !== t.id)
                          : [...tagIds, t.id]
                      )
                    }
                  />
                  {t.name}
                </label>
              ))}
            </div>

            {/* Upload foto */}
            <label className="file-label">
              Foto produk (kosongkan jika tidak ingin mengganti)

              <input
                type="file"
                accept="image/*"
                ref={fileRef}
              />
            </label>

            <button type="submit" className="btn-add" id="saveBtn">
              {editId !== null ? "Simpan perubahan" : "Tambah produk"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="btn-del"
                id="cancelBtn"
                onClick={resetForm}
              >
                Batal
              </button>
            )}
          </form>

          {/* Tabel daftar produk */}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Kategori</th>
                  <th>Tag</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    {/* Foto */}
                    <td>
                      <SafeImg src={p.img} className="thumb" />
                    </td>

                    {/* Nama */}
                    <td>{p.name}</td>

                    {/* Harga */}
                    <td>{formatRupiah(p.price)}</td>

                    {/* Kategori */}
                    <td>
                      {categories.find((c) => c.id === p.categoryId)?.name ?? "-"}
                    </td>

                    {/* Tag */}
                    <td>
                      {p.tags.map((t) => t.name).join(", ") || "-"}
                    </td>

                    {/* Stok */}
                    <td>
                      <strong>{p.stock}</strong> / {p.maxStock}
                      <br />

                      {p.stock === 0 ? (
                        <small className="stock-out">Habis</small>
                      ) : p.stock <= 5 ? (
                        <small className="stock-low">Menipis</small>
                      ) : (
                        <small>Tersedia</small>
                      )}
                    </td>

                    {/* Tombol aksi */}
                    <td>
                      <div className="admin-product-actions">
                        <button
                          type="button"
                          className="btn-add"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-add"
                          onClick={() => handleRestock(p.id)}
                          disabled={p.stock >= p.maxStock}
                        >
                          Refill
                        </button>

                        <button
                          type="button"
                          className="btn-del"
                          onClick={() => handleDelete(p.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL REFILL STOK */}
      {restockProductId !== null && restockProduct && (
        <div className="restock-overlay">
          <section
            className="restock-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="restockTitle"
          >
            <div className="restock-header">
              <h2 id="restockTitle">Refill Stok</h2>

              <button
                type="button"
                className="restock-close"
                onClick={closeRestockModal}
                disabled={restocking}
                aria-label="Tutup modal"
              >
                ×
              </button>
            </div>

            <p className="restock-product-name">
              {restockProduct.name}
            </p>

            <div className="restock-info">
              <div>
                <span>Stok sekarang</span>
                <strong>{restockProduct.stock}</strong>
              </div>

              <div>
                <span>Kapasitas maksimal</span>
                <strong>{restockProduct.maxStock}</strong>
              </div>

              <div>
                <span>Kapasitas tersisa</span>
                <strong>
                  {restockProduct.maxStock - restockProduct.stock}
                </strong>
              </div>
            </div>

            <form onSubmit={submitRestock}>
              <label htmlFor="restockQuantity">
                Jumlah stok yang ingin ditambahkan
              </label>

              <input
                id="restockQuantity"
                type="number"
                min={1}
                max={restockProduct.maxStock - restockProduct.stock}
                step={1}
                required
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="Contoh: 20"
              />

              <small>
                Maksimal refill:{" "}
                {restockProduct.maxStock - restockProduct.stock} produk
              </small>

              {restockError && (
                <p className="restock-error" role="alert">
                  {restockError}
                </p>
              )}

              <div className="restock-actions">
                <button
                  type="button"
                  className="btn-del"
                  onClick={closeRestockModal}
                  disabled={restocking}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn-add"
                  disabled={restocking}
                >
                  {restocking ? "Menyimpan..." : "Simpan Refill"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Link kembali dan logout */}
      <p className="alt">
        <Link href="/store">Kembali ke toko</Link> |{" "}
        <a
          href="#"
          onClick={async (e) => {
            e.preventDefault();
            await logout();
            await refresh();
            router.push("/store/login");
          }}
        >
          Keluar (log out)
        </a>
      </p>

    </main>
  );
}


// tipe data pembelian
type Purchase = {
  id: number;
  total: number;
  createdAt: string;
  note: string | null;
  status: string;
  user: { name: string; email: string };
  items: { id: number; productName: string; qty: number }[];
};

// data ringkasan penjualan
type SalesSummary = {
  transactionCount: number;
  itemCount: number;
  totalRevenue: number;
  updatedAt: string;
  products: { productId: number; productName: string; qty: number; revenue: number }[];
};
