import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedMedia } from "./media";
import { seedSite } from "./site";
import { seedSections } from "./section";

const prisma = new PrismaClient();

async function main() {
  await seedMedia(prisma);
  await seedSite(prisma);
  await seedSections(prisma);

  await prisma.user.upsert({
    where: { email: "admin@rendang.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@rendang.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Rendang Daging Sapi", price: 85000, img: "/Photos/Rendang Sapi.jpg" },
        { name: "Rendang Ayam", price: 65000, img: "/Photos/Rendang Ayam.jpg" },
        { name: "Rendang Itik", price: 75000, img: "/Photos/Rendang Itik.jpg" },
        { name: "Kalio", price: 70000, img: "/Photos/Kalio.jpg" },
        { name: "Rendang Paru", price: 60000, img: "/Photos/Rendang Paru.jpg" },
      ],
    });
  }

  const makanan = await prisma.category.upsert({
    where: { name: "Makanan" }, update: {}, create: { name: "Makanan", position: 1 },
  });
  await prisma.category.upsert({
    where: { name: "Minuman" }, update: {}, create: { name: "Minuman", position: 2 },
  });
  await prisma.category.upsert({
    where: { name: "Dessert" }, update: {}, create: { name: "Dessert", position: 3 },
  });
  await prisma.product.updateMany({ where: { categoryId: null }, data: { categoryId: makanan.id } });

  const TAGS_BY_PRODUCT: Record<string, string[]> = {
    "Rendang Daging Sapi": ["Pedas", "Tradisional", "Daging Sapi"],
    "Rendang Ayam": ["Pedas", "Unggas"],
    "Rendang Itik": ["Pedas", "Unggas"],
    "Kalio": ["Tradisional", "Daging Sapi"],
    "Rendang Paru": ["Pedas", "Tradisional"],
  };

  const TAGS_BY_RENDANG_TYPE: Record<string, string[]> = {
    "Rendang Sapi": ["Pedas", "Tradisional", "Daging Sapi"],
    "Rendang Ayam": ["Pedas", "Unggas"],
    "Rendang Itik": ["Pedas", "Unggas"],
    "Rendang Paru": ["Pedas", "Tradisional"],
    "Kalio": ["Tradisional", "Daging Sapi"],
  };
  
  for (const [productName, tagNames] of Object.entries(TAGS_BY_PRODUCT)) {
    for (const name of tagNames) {
      await prisma.tag.upsert({ where: { name }, update: {}, create: { name } });
    }
    const product = await prisma.product.findFirst({ where: { name: productName } });
    if (!product) continue;
    await prisma.product.update({
      where: { id: product.id },
      data: { tags: { set: tagNames.map((name) => ({ name })) } },
    });
  }

  for (const [title, tagNames] of Object.entries(TAGS_BY_RENDANG_TYPE)) {
    for (const name of tagNames) {
      await prisma.tag.upsert({ where: { name }, update: {}, create: { name } });
    }
    const type = await prisma.rendangType.findFirst({ where: { title } });
    if (!type) continue;
    await prisma.rendangType.update({
      where: { id: type.id },
      data: { tags: { set: tagNames.map((name) => ({ name })) } },
    });
  }
}
main().finally(() => prisma.$disconnect());