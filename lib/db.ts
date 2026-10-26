import type { Product } from "./types";

export const FALLBACK_IMG = "/Photos/Rendang.jpg";

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: "Rendang Daging Sapi", price: 85000, img: "/Photos/Rendang.jpg" },
  { id: 2, name: "Rendang Ayam", price: 65000, img: "/Photos/Rendang.jpg" },
  { id: 3, name: "Rendang Itik", price: 75000, img: "/Photos/Rendang.jpg" },
  { id: 4, name: "Kalio", price: 70000, img: "/Photos/Rendang.jpg" },
  { id: 5, name: "Rendang Paru", price: 60000, img: "/Photos/Rendang.jpg" },
];

export function getProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("products");
  if (!data) {
    localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(data) as Product[];
}

export function saveProducts(list: Product[]): boolean {
  try {
    localStorage.setItem("products", JSON.stringify(list));
    return true;
  } catch {
    alert("Penyimpanan penuh. Hapus produk lama atau pakai gambar yang lebih kecil.");
    return false;
  }
}

export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}