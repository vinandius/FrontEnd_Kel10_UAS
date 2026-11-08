import type { PrismaClient } from "@prisma/client";

type ParagraphSeed = { kind: "lead" | "body" | "note" | "quote"; text: string };
type ItemSeed = { kind: string; title: string; text?: string; accent?: string; image?: string };
type SectionSeed = {
  key: string;
  label: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  paragraphs?: ParagraphSeed[];
  items?: ItemSeed[];
};

const SECTIONS: SectionSeed[] = [
  {
    key: "origin",
    label: "ASAL-USUL",
    title: "Berawal dari Minangkabau",
    image: "/Photos/minangkabau.jpg",
    paragraphs: [
      {
        kind: "lead",
        text: "Rendang merupakan masakan tradisional yang identik dengan masyarakat Minangkabau, Sumatera Barat.",
      },
      {
        kind: "body",
        text: "Rendang berkembang dalam tradisi kuliner Minangkabau dan menjadi bagian dari kehidupan masyarakatnya. Dari wilayah inilah rendang kemudian dikenal luas sebagai salah satu masakan Indonesia.",
      },
    ],
  },
  {
    key: "about",
    label: "MENGENAL RENDANG",
    title: "Apa sebenarnya rendang?",
    image: "/Photos/Rendang.jpg",
    paragraphs: [
      {
        kind: "body",
        text: "Rendang merupakan masakan yang identik dengan masyarakat Minangkabau, Sumatera Barat. Hidangan ini dibuat dengan daging, santan, cabai, dan berbagai rempah yang dimasak dalam waktu lama.",
      },
      {
        kind: "body",
        text: "Proses memasak yang panjang membuat cairan semakin berkurang hingga menghasilkan bumbu yang pekat dan melekat pada daging.",
      },
    ],
    items: [
      {
        kind: "highlight",
        title: "Marandang",
        text: 'Istilah "marandang" merujuk pada proses memasak santan dan bumbu secara perlahan hingga mengering dan menyusut.',
      },

      {
        kind: "fact",
        title: "Semakin lama dimasak, semakin pekat.",
        text: "Rendang umumnya memiliki warna cokelat gelap hingga hitam pekat setelah dimasak dalam waktu lama.",
        image: "/Photos/rendang-hitam.jpeg",
      },
      {
        kind: "fact",
        title: "Sebelum menjadi rendang, ada kalio.",
        text: 'Jika daging yang dimasak masih berwarna merah kecokelatan dan dimasak tidak sampai kering, masyarakat Minangkabau menyebutnya "Kalio".',
        image: "/Photos/kalio.jpeg",
      },
      {
        kind: "info",
        title: "Waktu menjadi bagian dari rasa.",
        text: "Proses memasak yang panjang membuat kuah semakin berkurang dan bumbu semakin menempel pada bahan. Perubahan inilah yang membuat rendang memiliki karakter yang berbeda dari masakan bersantan lainnya.",
        image: "/Photos/masak-rendang.jpg",
      },
      {
        kind: "info",
        title: "Gelap bukan berarti gosong.",
        text: "Warna gelap pada rendang terbentuk dari proses memasak yang panjang dan perubahan warna bumbu selama cairan terus berkurang.",
        image: "/Photos/rendang-hitam2.jpg",
      },
    ],
  },
  {
    key: "process",
    label: "PROSES MASAK",
    title: "Dari Gulai menjadi Rendang",
    description:
      "Rendang tidak langsung menjadi kering. Proses memasaknya berkembang melalui perubahan tekstur dan jumlah cairan.",
    items: [
      { kind: "step", title: "Gulai", text: "Santan masih banyak dan kuah masih relatif encer." },
      { kind: "step", title: "Kalio", text: "Cairan mulai berkurang dan bumbu menjadi semakin kental." },
      {
        kind: "step",
        title: "Rendang",
        text: "Cairan semakin menguap hingga menghasilkan bumbu yang pekat dan melekat pada bahan.",
      },
    ],
  },
  {
    key: "recipe",
    label: "BAHAN",
    title: "Bukan cuma daging.",
    subtitle: "Karakter rendang dibangun dari rempah.",
    description:
      "Pertemuan daging, santan, cabai, dan rempah membentuk rasa yang menjadi ciri khas rendang.",
    image: "/Photos/bumbu.png",
    paragraphs: [
      {
        kind: "note",
        text: "Bumbu halus dapat meliputi bawang, cabai merah, jahe, kunyit, lengkuas, dan ketumbar. Rempah aromatiknya antara lain serai, daun salam, daun jeruk, dan daun kunyit.",
      },
    ],
    items: [

      { kind: "bubble", title: "Cabai", image: "/Photos/cabe.png", accent: "red" },
      { kind: "bubble", title: "Jahe", image: "/Photos/jahe.png", accent: "gold" },
      { kind: "bubble", title: "Lengkuas", image: "/Photos/lengkuas.png", accent: "brown-light" },
      { kind: "bubble", title: "Santan", image: "/Photos/santan.png", accent: "cream-light" },
      { kind: "bubble", title: "Serai", image: "/Photos/daun.png", accent: "green" },

      { kind: "ingredient", title: "Daging" },
      { kind: "ingredient", title: "Santan" },
      { kind: "ingredient", title: "Cabai" },
      { kind: "ingredient", title: "Rempah" },
    ],
  },
  {
    key: "meaning",
    label: "MAKNA",
    title: "Lebih dari sekadar hidangan.",
    paragraphs: [
      { kind: "quote", text: "Sebuah hidangan yang membutuhkan waktu, kesabaran, dan banyak rempah." },
    ],
    items: [
      {
        kind: "card",
        title: "Tradisi",
        text: "Rendang hadir dalam berbagai kegiatan dan tradisi masyarakat Minangkabau.",
      },
      {
        kind: "card",
        title: "Perjalanan",
        text: "Rendang dikenal sebagai makanan yang dapat bertahan lama sehingga sesuai dengan perjalanan masyarakat Minangkabau.",
      },
      {
        kind: "card",
        title: "Warisan",
        text: "Pengetahuan tentang bahan dan cara memasak diteruskan dari satu generasi ke generasi berikutnya.",
      },
    ],
  },
  {
    key: "character",
    label: "KARAKTER",
    title: "Tiga hal yang membentuk karakter rendang.",
    items: [
      { kind: "trait", title: "Rempah", text: "Memberikan aroma, warna, dan lapisan rasa." },
      {
        kind: "trait",
        title: "Santan",
        text: "Menjadi bagian penting dari dasar masakan dan membantu membentuk tekstur bumbu.",
      },
      {
        kind: "trait",
        title: "Waktu",
        text: "Mengubah cairan, tekstur, warna, dan kekuatan rasa selama proses memasak.",
      },
    ],
  },
  {
    key: "types",
    label: "JENIS",
    title: "Jenis Rendang",
    description:
      "Rendang tidak hanya hadir dalam satu bentuk. Bahan dan daerah pengolahannya dapat menghasilkan variasi yang berbeda.",
  },
  {
    key: "closing",
    label: "PENUTUP",
    title: "Dari tanah Minangkabau, lahir rasa yang panjang ceritanya.",
    description:
      "Rendang membawa lebih dari sekadar rasa. Di balik rempah dan waktu, ada tradisi yang terus diwariskan.",
  },
];

const RENDANG_TYPES = [
  {
    title: "Rendang Sapi",
    description: "Rendang berbahan daging sapi yang dimasak bersama santan dan rempah.",
    image: "/Photos/Rendang Sapi.jpg",
  },
  {
    title: "Rendang Ayam",
    description: "Variasi rendang menggunakan daging ayam dengan bumbu rempah.",
    image: "/Photos/Rendang Ayam.jpg",
  },
  {
    title: "Rendang Itik",
    description: "Olahan itik yang dimasak perlahan bersama bumbu rendang.",
    image: "/Photos/Rendang Itik.jpg",
  },
  {
    title: "Rendang Paru",
    description: "Variasi rendang yang menggunakan paru sebagai bahan utamanya.",
    image: "/Photos/Rendang Paru.jpg",
  },
  {
    title: "Kalio",
    description: "Olahan bersantan dengan bumbu yang masih lebih basah daripada rendang kering.",
    image: "/Photos/Kalio.jpg",
  },
];

export async function seedSections(prisma: PrismaClient) {
  if ((await prisma.section.count()) === 0) {
    for (const [index, section] of SECTIONS.entries()) {
      const { image, paragraphs = [], items = [], ...fields } = section;
      await prisma.section.create({
        data: {
          ...fields,
          position: index + 1,
          image: image ? { connect: { url: image } } : undefined,
          paragraphs: {
            create: paragraphs.map((p, i) => ({ ...p, position: i + 1 })),
          },
          items: {
            create: items.map(({ image: itemImage, ...item }, i) => ({
              ...item,
              position: i + 1,
              image: itemImage ? { connect: { url: itemImage } } : undefined,
            })),
          },
        },
      });
    }
  }

  if ((await prisma.rendangType.count()) === 0) {
    for (const [index, { image, ...type }] of RENDANG_TYPES.entries()) {
      await prisma.rendangType.create({
        data: { ...type, position: index + 1, image: { connect: { url: image } } },
      });
    }
  }
}