import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/session";

async function checkAdmin() {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { message: "Login terlebih dahulu." },
      { status: 401 }
    );
  }

  if (session.role !== "admin") {
    return Response.json(
      { message: "Akses admin diperlukan." },
      { status: 403 }
    );
  }

  return null;
}

export async function GET() {
  const denied = await checkAdmin();

  if (denied) return denied;

  const purchases = await prisma.purchase.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: true,
    },
  });

  return Response.json(purchases);
}

export async function PATCH(request: Request) {
  const denied = await checkAdmin();

  if (denied) return denied;

  try {
    const { id, status } = await request.json();

    const purchaseId = Number(id);

    const allowedStatus = [
      "PENDING",
      "PROCESSING",
      "COMPLETED",
    ];

    if (
      !Number.isInteger(purchaseId) ||
      !allowedStatus.includes(status)
    ) {
      return Response.json(
        { message: "ID atau status tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!existing) {
      return Response.json(
        { message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (
      existing.status === "COMPLETED" &&
      status !== "COMPLETED"
    ) {
      return Response.json(
        { message: "Pesanan selesai tidak dapat diubah kembali." },
        { status: 400 }
      );
    }

    const updated = await prisma.purchase.update({
      where: { id: purchaseId },
      data: { status },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Update purchase status error:", error);

    return Response.json(
      { message: "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}