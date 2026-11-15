import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";

const unauthorized = () =>
  Response.json(
    { message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );

export async function GET() {
  const session = await getSession();

  if (!session) return unauthorized();

  const items = await prisma.cartItem.findMany({
    where: { userId: session.id },
    orderBy: { id: "asc" },
  });

  return Response.json(
    items.map((item) => ({
      id: item.productId,
      qty: item.qty,
    }))
  );
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) return unauthorized();

  try {
    const { productId } = await request.json();
    const id = Number(productId);

    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        { message: "Produk tidak valid." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
      });

      if (!product) throw new Error("PRODUCT_NOT_FOUND");
      if (product.stock <= 0) throw new Error("OUT_OF_STOCK");

      const existing = await tx.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: session.id,
            productId: id,
          },
        },
      });

      const nextQty = (existing?.qty ?? 0) + 1;

      if (nextQty > product.stock) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      await tx.cartItem.upsert({
        where: {
          userId_productId: {
            userId: session.id,
            productId: id,
          },
        },
        update: {
          qty: { increment: 1 },
        },
        create: {
          userId: session.id,
          productId: id,
          qty: 1,
        },
      });
    });

    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "PRODUCT_NOT_FOUND") {
      return Response.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    if (
      message === "OUT_OF_STOCK" ||
      message === "INSUFFICIENT_STOCK"
    ) {
      return Response.json(
        { message: "Jumlah produk melebihi stok yang tersedia." },
        { status: 409 }
      );
    }

    console.error("Cart POST error:", error);

    return Response.json(
      { message: "Gagal menambahkan produk." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) return unauthorized();

  try {
    const { productId, qty } = await request.json();

    const id = Number(productId);
    const quantity = Number(qty);

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return Response.json(
        { message: "Jumlah atau produk tidak valid." },
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

    if (quantity > product.stock) {
      return Response.json(
        { message: `Stok tersedia hanya ${product.stock}.` },
        { status: 409 }
      );
    }

    const updated = await prisma.cartItem.updateMany({
      where: {
        userId: session.id,
        productId: id,
      },
      data: { qty: quantity },
    });

    if (updated.count === 0) {
      return Response.json(
        { message: "Produk tidak ditemukan di keranjang." },
        { status: 404 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Cart PATCH error:", error);

    return Response.json(
      { message: "Gagal mengubah jumlah produk." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session) return unauthorized();

  const productId = new URL(request.url).searchParams.get("productId");

  await prisma.cartItem.deleteMany({
    where: productId
      ? {
          userId: session.id,
          productId: Number(productId),
        }
      : {
          userId: session.id,
        },
  });

  return Response.json({ ok: true });
}