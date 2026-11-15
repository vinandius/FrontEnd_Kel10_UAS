import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";

function countWords(value: string): number {
  const trimmed = value.trim();

  if (!trimmed) return 0;

  return trimmed.split(/\s+/).filter(Boolean).length;
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { message: "Login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    const note =
      typeof body.note === "string"
        ? body.note.trim()
        : "";

    if (countWords(note) > 20) {
      return Response.json(
        { message: "Catatan maksimal 20 kata." },
        { status: 400 }
      );
    }

    const purchase = await prisma.$transaction(
      async (tx) => {
        const cart = await tx.cartItem.findMany({
          where: { userId: session.id },
          include: { product: true },
          orderBy: { id: "asc" },
        });

        if (cart.length === 0) {
          throw new Error("EMPTY_CART");
        }

        // buat periksa dan kurangi stok menggunakan kondisi atomik.
        for (const item of cart) {
          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.qty },
            },
            data: {
              stock: { decrement: item.qty },
            },
          });

          if (updated.count !== 1) {
            throw new Error(
              `INSUFFICIENT_STOCK:${item.product.name}`
            );
          }
        }

        const total = cart.reduce(
          (sum, item) =>
            sum + item.product.price * item.qty,
          0
        );

        const created = await tx.purchase.create({
          data: {
            userId: session.id,
            total,
            note: note || null,
            status: "PENDING",

            items: {
              create: cart.map((item) => ({
                productId: item.productId,
                productName: item.product.name,
                price: item.product.price,
                qty: item.qty,
              })),
            },
          },
        });

        await tx.cartItem.deleteMany({
          where: { userId: session.id },
        });

        return created;
      }
    );

    return Response.json({
      ok: true,
      id: purchase.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "EMPTY_CART") {
      return Response.json(
        { message: "Keranjang masih kosong." },
        { status: 400 }
      );
    }

    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = message.split(":")[1];

      return Response.json(
        {
          message: `Stok ${productName} tidak mencukupi. Silakan perbarui keranjang.`,
        },
        { status: 409 }
      );
    }

    console.error("Checkout error:", error);

    return Response.json(
      { message: "Checkout gagal disimpan." },
      { status: 500 }
    );
  }
}