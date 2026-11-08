export type Product = { id: number; name: string; price: number; img: string };

export const FALLBACK_IMG = "/Photos/Rendang.jpg";

export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
