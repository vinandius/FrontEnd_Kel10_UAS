export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

/** 1 -> "01", dipakai untuk nomor kartu / langkah. */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Label blok halaman, mis. "03 · PROSES MASAK". Nomornya otomatis dari urutan di database. */
export function sectionLabel(section: { position: number; label: string }): string {
  return `${pad2(section.position)} · ${section.label}`;
}

/** Ambil teks dari TextMap. Jika kuncinya belum ada di database, kuncinya yang tampil supaya mudah ketahuan. */
export function tx(texts: Record<string, string>, key: string): string {
  return texts[key] ?? key;
}