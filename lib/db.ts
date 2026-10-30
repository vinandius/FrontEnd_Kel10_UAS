export type Product = { id: number; name: string; price: number; img: string };
export type User = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
};

export const FALLBACK_IMG = "/Photos/Rendang.jpg";

const PRODUCTS: Product[] = [
  { id: 1, name: "Rendang Daging Sapi", price: 85000, img: "/Photos/Rendang Sapi.jpg" },
  { id: 2, name: "Rendang Ayam", price: 65000, img: "/Photos/Rendang Ayam.jpg" },
  { id: 3, name: "Rendang Itik", price: 75000, img: "/Photos/Rendang Itik.jpg" },
  { id: 4, name: "Kalio", price: 70000, img: "/Photos/Kalio.jpg" },
  { id: 5, name: "Rendang Paru", price: 60000, img: "/Photos/Rendang Paru.jpg" },
];

// Semua fungsi di file ini hanya boleh dipanggil di browser (useEffect / event handler)
export function getProducts(): Product[] {
  const data = localStorage.getItem("products");
  if (!data) {
    localStorage.setItem("products", JSON.stringify(PRODUCTS));
    return PRODUCTS;
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

export function getUsers(): User[] {
  const raw = localStorage.getItem("users");
  if (!raw) {
    const seed: User[] = [
      { name: "Admin", email: "admin@rendang.com", password: "admin123", role: "admin" },
    ];
    localStorage.setItem("users", JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as User[];
}

export function saveUsers(users: User[]) {
  localStorage.setItem("users", JSON.stringify(users));
}