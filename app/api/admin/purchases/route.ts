import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ message: "Login dulu." }, { status: 401 });
  if (session.role !== "admin") return Response.json({ message: "Akses admin diperlukan." }, { status: 403 });

  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, items: true },
  });
  return Response.json(purchases);
}