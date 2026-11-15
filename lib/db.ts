export type Tag = { id: number; name: string };
export type Category = { id: number; name: string };
export type Product = {   id: number; name: string; price: number; img: string; stock: number; maxStock: number; categoryId: number | null; tags: Tag[]; };

export const FALLBACK_IMG = "/Photos/Rendang.jpg";

export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
