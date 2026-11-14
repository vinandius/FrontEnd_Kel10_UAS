import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/session";

function jakartaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ message: "Login dulu." }, { status: 401 });
  if (session.role !== "admin") return Response.json({ message: "Akses admin diperlukan." }, { status: 403 });

  const date = jakartaToday();
  const start = new Date(`${date}T00:00:00+07:00`);
  const end = new Date(`${date}T00:00:00+07:00`);
  end.setUTCDate(end.getUTCDate() + 1);

  const purchases = await prisma.purchase.findMany({
    where: { createdAt: { gte: start, lt: end } },
    include: { items: true },
  });
  const products = Object.values(purchases.flatMap((purchase) => purchase.items).reduce<Record<number, {
    productId: number;
    productName: string;
    qty: number;
    revenue: number;
  }>>((result, item) => {
    const current = result[item.productId] ?? {
      productId: item.productId,
      productName: item.productName,
      qty: 0,
      revenue: 0,
    };
    current.qty += item.qty;
    current.revenue += item.price * item.qty;
    result[item.productId] = current;
    return result;
  }, {}));

  const summary = {
    transactionCount: purchases.length,
    itemCount: purchases.reduce((sum, purchase) => sum + purchase.items.reduce((items, item) => items + item.qty, 0), 0),
    totalRevenue: purchases.reduce((sum, purchase) => sum + purchase.total, 0),
  };

  const saved = await prisma.dailySalesSummary.upsert({
    where: { summaryDate: new Date(`${date}T00:00:00Z`) },
    update: summary,
    create: { summaryDate: new Date(`${date}T00:00:00Z`), ...summary },
  });
  return Response.json({ ...saved, products });
}