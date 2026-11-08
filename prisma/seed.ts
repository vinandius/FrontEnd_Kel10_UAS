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
}

main().finally(() => prisma.$disconnect());