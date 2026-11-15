import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/session";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  { params }: Context
) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return Response.json(
      { message: "Akses admin diperlukan." },
      { status: 403 }
    );
  }

  try {
    const id = Number((await params).id);
    const { quantity } = await request.json();

    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        { message: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const amount = Number(quantity);

    if (!Number.isInteger(amount) || amount <= 0) {
      return Response.json(
        { message: "Jumlah refill harus berupa bilangan bulat positif." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return Response.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    const newStock = product.stock + amount;

    if (newStock > product.maxStock) {
      return Response.json(
        {
          message: `Refill melebihi kapasitas. Stok sekarang ${product.stock}, maksimal ${product.maxStock}.`,
        },
        { status: 400 }
      );
    }

    // Cegah dua admin melakukan refill bersamaan berdasarkan stok yang terakhir dibaca.
    const updated = await prisma.product.updateMany({
      where: {
        id,
        stock: product.stock,
        maxStock: product.maxStock,
      },
      data: {
        stock: { increment: amount },
      },
    });

    if (updated.count !== 1) {
      return Response.json(
        { message: "Stok berubah. Silakan coba lagi." },
        { status: 409 }
      );
    }

    const result = await prisma.product.findUnique({
      where: { id },
    });

    return Response.json({
      message: "Refill berhasil.",
      product: result,
    });
  } catch (error) {
    console.error("Restock error:", error);

    return Response.json(
      { message: "Gagal melakukan refill." },
      { status: 500 }
    );
  }
}