export type FieldType = "text" | "textarea" | "number" | "bool" | "select" | "relation" | "image" | "upload";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  optional?: boolean;
  locked?: boolean;
  options?: string[];
  to?: string;
  show?: string;
  rel?: string;
};

export type ModelConfig = {
  key: string;
  label: string;
  desc: string;
  fields: Field[];
  columns: string[];
  order: string[];
  canAdd: boolean;
  canDelete: boolean;
};

export const MODELS: ModelConfig[] = [
  {
    key: "siteText",
    label: "Teks Situs",
    desc: "Teks kecil di halaman (judul, tombol, pesan) yang diambil lewat kunci.",
    fields: [
      { name: "group", label: "Grup", type: "text" },
      { name: "key", label: "Kunci", type: "text" },
      { name: "value", label: "Isi teks", type: "textarea" },
      { name: "description", label: "Keterangan", type: "text", optional: true },
    ],
    columns: ["group", "key", "value"],
    order: ["group", "key"],
    canAdd: true,
    canDelete: true,
  },
  {
    key: "siteSetting",
    label: "Pengaturan Situs",
    desc: "Judul tab browser, deskripsi, email kontak, teks footer, dan gambar cadangan.",
    fields: [
      { name: "metaTitle", label: "Judul situs", type: "text" },
      { name: "metaDescription", label: "Deskripsi situs", type: "textarea" },
      { name: "language", label: "Bahasa", type: "text" },
      { name: "contactHeading", label: "Judul kontak", type: "text" },
      { name: "socialPrompt", label: "Ajakan sosial media", type: "text" },
      { name: "feedbackPrompt", label: "Ajakan masukan", type: "text" },
      { name: "contactEmail", label: "Email kontak", type: "text" },
      { name: "fallbackImageId", label: "Gambar cadangan", type: "image", rel: "fallbackImage", optional: true },
    ],
    columns: ["metaTitle", "contactEmail", "fallbackImageId"],
    order: ["id"],
    canAdd: false,
    canDelete: false,
  },
  {
    key: "navLink",
    label: "Menu Navigasi",
    desc: "Tautan di menu atas halaman utama dan toko.",
    fields: [
      { name: "menu", label: "Menu", type: "select", options: ["main", "store"] },
      { name: "label", label: "Label", type: "text" },
      { name: "path", label: "Alamat (path)", type: "text" },
      { name: "visibility", label: "Tampil untuk", type: "select", options: ["all", "guest", "member"] },
      { name: "position", label: "Urutan", type: "number" },
      { name: "isActive", label: "Aktif", type: "bool" },
    ],
    columns: ["menu", "label", "path", "visibility", "position", "isActive"],
    order: ["menu", "position"],
    canAdd: true,
    canDelete: true,
  },
  {
    key: "socialLink",
    label: "Media Sosial",
    desc: "Tautan dan ikon sosial media di footer.",
    fields: [
      { name: "platform", label: "Platform", type: "text" },
      { name: "label", label: "Label", type: "text" },
      { name: "url", label: "URL", type: "text" },
      { name: "iconId", label: "Ikon", type: "image", rel: "icon", optional: true },
      { name: "position", label: "Urutan", type: "number" },
      { name: "isActive", label: "Aktif", type: "bool" },
    ],
    columns: ["platform", "label", "url", "iconId", "isActive"],
    order: ["position"],
    canAdd: true,
    canDelete: true,
  },
  {
    key: "hero",
    label: "Hero (Banner)",
    desc: "Banner paling atas halaman utama dan toko: judul, teks, dan gambar.",
    fields: [
      { name: "page", label: "Halaman", type: "text", locked: true },
      { name: "eyebrow", label: "Teks kecil atas", type: "text", optional: true },
      { name: "title", label: "Judul", type: "text" },
      { name: "subtitle", label: "Subjudul", type: "textarea", optional: true },
      { name: "badge", label: "Badge", type: "text", optional: true },
      { name: "tagline", label: "Tagline", type: "text", optional: true },
      { name: "imageId", label: "Gambar", type: "image", rel: "image" },
    ],
    columns: ["page", "title", "imageId"],
    order: ["page"],
    canAdd: false,
    canDelete: false,
  },
  {
    key: "section",
    label: "Bagian Halaman",
    desc: "Blok-blok halaman utama (asal-usul, proses, resep, dll): judul, deskripsi, gambar, tampil/sembunyi.",
    fields: [
      { name: "key", label: "Kunci", type: "text", locked: true },
      { name: "position", label: "Urutan", type: "number" },
      { name: "label", label: "Label", type: "text" },
      { name: "title", label: "Judul", type: "text" },
      { name: "subtitle", label: "Subjudul", type: "text", optional: true },
      { name: "description", label: "Deskripsi", type: "textarea", optional: true },
      { name: "imageId", label: "Gambar", type: "image", rel: "image", optional: true },
      { name: "isVisible", label: "Tampilkan", type: "bool" },
    ],
    columns: ["position", "key", "title", "imageId", "isVisible"],
    order: ["position"],
    canAdd: false,
    canDelete: false,
  },
  {
    key: "sectionParagraph",
    label: "Paragraf",
    desc: "Paragraf teks di dalam tiap bagian halaman.",
    fields: [
      { name: "sectionId", label: "Bagian", type: "relation", to: "section", show: "key" },
      { name: "kind", label: "Jenis", type: "select", options: ["lead", "body", "note", "quote"] },
      { name: "text", label: "Teks", type: "textarea" },
      { name: "position", label: "Urutan", type: "number" },
    ],
    columns: ["sectionId", "kind", "text", "position"],
    order: ["sectionId", "position"],
    canAdd: true,
    canDelete: true,
  },
  {
    key: "sectionItem",
    label: "Item Bagian",
    desc: "Kartu, langkah, bahan, fakta, dan item lain di dalam tiap bagian, lengkap dengan gambarnya.",
    fields: [
      { name: "sectionId", label: "Bagian", type: "relation", to: "section", show: "key" },
      {
        name: "kind",
        label: "Jenis",
        type: "select",
        options: ["step", "card", "trait", "fact", "info", "highlight", "bubble", "ingredient"],
      },
      { name: "title", label: "Judul", type: "text" },
      { name: "text", label: "Teks", type: "textarea", optional: true },
      { name: "accent", label: "Aksen", type: "text", optional: true },
      { name: "imageId", label: "Gambar", type: "image", rel: "image", optional: true },
      { name: "position", label: "Urutan", type: "number" },
    ],
    columns: ["sectionId", "kind", "title", "imageId", "position"],
    order: ["sectionId", "kind", "position"],
    canAdd: true,
    canDelete: true,
  },
  {
    key: "rendangType",
    label: "Jenis Rendang",
    desc: "Kartu jenis rendang di halaman utama.",
    fields: [
      { name: "title", label: "Nama", type: "text" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "imageId", label: "Gambar", type: "image", rel: "image" },
      { name: "position", label: "Urutan", type: "number" },
      { name: "isVisible", label: "Tampilkan", type: "bool" },
    ],
    columns: ["title", "imageId", "position", "isVisible"],
    order: ["position"],
    canAdd: true,
    canDelete: true,
  },
  {
    key: "media",
    label: "Galeri Gambar",
    desc: "Semua gambar yang tersimpan di database. Gambar yang masih dipakai tidak bisa dihapus.",
    fields: [
      { name: "url", label: "File gambar", type: "upload" },
      { name: "alt", label: "Teks alternatif", type: "text" },
    ],
    columns: ["url", "alt"],
    order: ["id"],
    canAdd: true,
    canDelete: true,
  },
];