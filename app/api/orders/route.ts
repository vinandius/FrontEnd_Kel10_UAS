import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) return Response.json({ message: "Login dulu." }, { status: 401 });

  try {
    const purchase = await prisma.$transaction(async (tx) => {
      const cart = await tx.cartItem.findMany({
        where: { userId: session.id },
        include: { product: true },
        orderBy: { id: "asc" },
      });

      if (cart.length === 0) throw new Error("EMPTY_CART");

      const missingProduct = cart.find((item) => !item.product);
      if (missingProduct) throw new Error("PRODUCT_NOT_FOUND");

      const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
      const created = await tx.purchase.create({
        data: {
          userId: session.id,
          total,
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

      await tx.cartItem.deleteMany({ where: { userId: session.id } });
      return created;
    });

    return Response.json({ ok: true, id: purchase.id });
  } catch (error) {
    if (error instanceof Error && error.message === "EMPTY_CART") {
      return Response.json({ message: "Keranjang masih kosong." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return Response.json({ message: "Ada produk di keranjang yang sudah tidak tersedia." }, { status: 400 });
    }
    console.error("Checkout error:", error);
    const detail = process.env.NODE_ENV === "development" && error instanceof Error
      ? `Checkout gagal disimpan: ${error.message}`
      : "Checkout gagal disimpan.";
    return Response.json({ message: detail }, { status: 500 });
  }
}