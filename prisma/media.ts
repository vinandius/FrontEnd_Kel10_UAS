import type { PrismaClient } from "@prisma/client";

export const MEDIA = [

  // Origin
  { url: "/Photos/rendang-hero.jpg", alt: "Rendang" },
  { url: "/Photos/minangkabau.jpg", alt: "Minangkabau, Sumatera Barat" },

  // Tentang rendang
  { url: "/Photos/Rendang.jpg", alt: "Rendang" },
  { url: "/Photos/rendang-hitam.jpeg", alt: "Rendang berwarna gelap" },
  { url: "/Photos/kalio.jpeg", alt: "Kalio dan rendang" },
  { url: "/Photos/masak-rendang.jpg", alt: "Rendang" },
  { url: "/Photos/rendang-hitam2.jpg", alt: "Rendang gelap" },

  // Bahan
  { url: "/Photos/bumbu.png", alt: "Bumbu dan rempah rendang" },
  { url: "/Photos/cabe.png", alt: "Cabai" },
  { url: "/Photos/jahe.png", alt: "Jahe" },
  { url: "/Photos/lengkuas.png", alt: "Lengkuas" },
  { url: "/Photos/santan.png", alt: "Santan" },
  { url: "/Photos/daun.png", alt: "Serai" },

  // Jenis
  { url: "/Photos/Rendang Sapi.jpg", alt: "Rendang sapi" },
  { url: "/Photos/Rendang Ayam.jpg", alt: "Rendang ayam" },
  { url: "/Photos/Rendang Itik.jpg", alt: "Rendang itik" },
  { url: "/Photos/Rendang Paru.jpg", alt: "Rendang paru" },
  { url: "/Photos/Kalio.jpg", alt: "Kalio" },
];

export async function seedMedia(prisma: PrismaClient) {
  if ((await prisma.media.count()) > 0) return;
  await prisma.media.createMany({ data: MEDIA });
}