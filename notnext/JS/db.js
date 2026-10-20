/* Berfungsi sebagai pengganti database :
   Bertujuan untuk menyimpan data produk dan data pengguna */

const PRODUCTS = [
  { id: 1, name: "Rendang Daging Sapi", price: 85000, img: "Photos/Rendang Sapi.jpg" },
  { id: 2, name: "Rendang Ayam",        price: 65000, img: "Photos/Rendang Ayam.jpg" },
  { id: 3, name: "Rendang Itik",        price: 75000, img: "Photos/Rendang Itik.jpg" },
  { id: 4, name: "Kalio",               price: 70000, img: "Photos/Kalio.jpg" },
  { id: 5, name: "Rendang Paru",        price: 60000, img: "Photos/Rendang Paru.jpg" }
];

function getProducts() {
  const data = localStorage.getItem("products");
  if (!data) {
    localStorage.setItem("products", JSON.stringify(PRODUCTS));
    return PRODUCTS;
  }
  return JSON.parse(data);
}

function saveProducts(list) {
  try {
    localStorage.setItem("products", JSON.stringify(list));
    return true;
  } catch (e) {
    alert("Penyimpanan penuh. Hapus produk lama atau pakai gambar yang lebih kecil.");
    return false;
  }
}

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function initUsers() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([
      { name: "Admin", email: "admin@rendang.com", password: "admin123", role: "admin" }
    ]));
  }
}
initUsers();

const FALLBACK_IMG = "Photos/Rendang.jpg";
const IMG_FALLBACK_ATTR = `onerror="this.onerror=null; this.src='${FALLBACK_IMG}'"`;
