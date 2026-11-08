import type { PrismaClient } from "@prisma/client";

const SETTINGS = {
  metaTitle: "Rendang - Warisan Kuliner Nusantara",
  metaDescription:
    "Mengenal rendang dari Minangkabau: asal-usul, proses memasak, bahan, makna, dan jenis-jenisnya.",
  language: "id",
  contactHeading: "Contact",
  socialPrompt: "Kunjungi instagram kami!",
  feedbackPrompt: "Kritik dan saran? Silakan hubungi email kami:",
  contactEmail: "rendang@email.com",
  fallbackImage: "/Photos/Rendang.jpg",
};

const NAV_LINKS = [
  { menu: "main", label: "Home", path: "/" },
  { menu: "main", label: "Asal", path: "/home/asal-usul" },
  { menu: "main", label: "About", path: "/home/tentang-rendang" },
  { menu: "main", label: "Proses", path: "/home/proses" },
  { menu: "main", label: "Bahan", path: "/home/resep" },
  { menu: "main", label: "Makna", path: "/home/makna-rendang" },
  { menu: "main", label: "Karakter", path: "/home/karakter-rendang" },
  { menu: "main", label: "Jenis", path: "/home/jenis-rendang" },
  { menu: "main", label: "Contact", path: "/#contact" },
  { menu: "main", label: "Toko", path: "/store" },

  { menu: "store", label: "Home", path: "/" },
  { menu: "store", label: "Lists", path: "#jendang" },
  { menu: "store", label: "Contact", path: "#contact" },
  { menu: "store", label: "Keranjang", path: "/store/cart" },
  { menu: "store", label: "Akun", path: "/store/acc", visibility: "member" },
  { menu: "store", label: "Login", path: "/store/login", visibility: "guest" },
];

const SOCIAL_LINKS: { platform: string; label: string; url: string; icon?: string }[] = [
  {
    platform: "instagram",
    label: "@instagramrendang",
    url: "https://www.instagram.com/instagramrendang",
  },
];

const HEROES = [
  {
    page: "home",
    eyebrow: "WARISAN KULINER NUSANTARA",
    title: "RENDANG",
    subtitle: "Dari Minangkabau, Sumatera barat",
    badge: "MINANGKABAU",
    tagline: "Rasa yang lahir dari waktu ke waktu.",
    image: "/Photos/rendang-hero.jpg",
  },
  {
    page: "store",
    title: "TOKO RENDANG",
    image: "/Photos/rendang-hero.jpg",
  },
];

const TEXTS: { group: string; key: string; value: string; description?: string }[] = [
  // Asal-usul
  { group: "origin", key: "origin.badge.prefix", value: "DARI", description: "Teks kecil di atas nama daerah pada foto" },
  { group: "origin", key: "origin.badge.name", value: "MINANGKABAU", description: "Nama daerah besar pada foto" },
  { group: "origin", key: "origin.badge.region", value: "Sumatera Barat", description: "Teks di bawah nama daerah" },
  { group: "origin", key: "origin.location.label", value: "ASAL" },
  { group: "origin", key: "origin.location.value", value: "Minangkabau, Sumatera Barat" },

  // Bahan
  { group: "recipe", key: "recipe.center.top", value: "RASA", description: "Teks kecil di lingkaran tengah" },
  { group: "recipe", key: "recipe.center.bottom", value: "MINANG", description: "Teks besar di lingkaran tengah" },
  { group: "recipe", key: "recipe.side.label", value: "RASA YANG DIBANGUN BERSAMA" },
  { group: "recipe", key: "recipe.side.title", value: "Rempah, santan, dan waktu." },
  {
    group: "recipe",
    key: "recipe.side.description",
    value: "Rendang menggunakan berbagai rempah yang menjadi bagian penting dari rasa dan aromanya.",
  },

  // Jenis rendang (halaman utama)
  { group: "types", key: "types.search.placeholder", value: "Cari jenis rendang" },
  { group: "types", key: "types.empty", value: "Jenis rendang tidak ditemukan." },

  // Penutup
  { group: "closing", key: "closing.backToTop", value: "Kembali ke atas ↑" },

  // Toko
  { group: "store", key: "store.list.title", value: "Jenis Rendang" },
  { group: "store", key: "store.search.placeholder", value: "Cari jenis rendang" },
  { group: "store", key: "store.empty", value: "Rendang tidak ditemukan." },
  { group: "store", key: "store.addToCart", value: "+ Keranjang" },
  { group: "store", key: "store.notif.added", value: "Berhasil ditambahkan ke keranjang!" },
  { group: "store", key: "store.auth.title", value: "Akses Ditolak" },
  { group: "store", key: "store.auth.loginButton", value: "Ke Halaman Login" },
  {
    group: "store",
    key: "store.auth.needLoginAdd",
    value: "Silakan masuk (login) terlebih dahulu untuk menambahkan ke keranjang.",
  },

  // Keranjang
  { group: "cart", key: "cart.title", value: "Keranjang" },
  { group: "cart", key: "cart.empty", value: "Keranjang kosong. Pilih rendang dulu di halaman utama." },
  { group: "cart", key: "cart.total", value: "Total:" },
  { group: "cart", key: "cart.checkout", value: "Checkout" },
  { group: "cart", key: "cart.remove", value: "Hapus" },
  { group: "cart", key: "cart.continue", value: "Lanjut belanja" },
  { group: "cart", key: "cart.checkoutEmpty", value: "Keranjang masih kosong." },
  { group: "cart", key: "cart.checkoutSuccess", value: "Pesanan berhasil dibuat! Total:" },
  {
    group: "cart",
    key: "cart.needLogin",
    value: "Silakan masuk (login) terlebih dahulu untuk melihat keranjang belanja Anda.",
  },
];

export async function seedSite(prisma: PrismaClient) {
  if ((await prisma.siteSetting.count()) === 0) {
    const { fallbackImage, ...settings } = SETTINGS;
    await prisma.siteSetting.create({
      data: { id: 1, ...settings, fallbackImage: { connect: { url: fallbackImage } } },
    });
  }

  if ((await prisma.siteText.count()) === 0) {
    await prisma.siteText.createMany({ data: TEXTS });
  }

  if ((await prisma.navLink.count()) === 0) {
    // posisi dihitung per menu supaya urutan tiap menu mulai dari 1
    const counters: Record<string, number> = {};
    await prisma.navLink.createMany({
      data: NAV_LINKS.map((link) => {
        counters[link.menu] = (counters[link.menu] ?? 0) + 1;
        return { ...link, position: counters[link.menu] };
      }),
    });
  }

  if ((await prisma.socialLink.count()) === 0) {
    for (const [index, { icon, ...link }] of SOCIAL_LINKS.entries()) {
      await prisma.socialLink.create({
        data: {
          ...link,
          position: index + 1,
          icon: icon ? { connect: { url: icon } } : undefined,
        },
      });
    }
  }

  if ((await prisma.hero.count()) === 0) {
    for (const { image, ...hero } of HEROES) {
      await prisma.hero.create({ data: { ...hero, image: { connect: { url: image } } } });
    }
  }
}