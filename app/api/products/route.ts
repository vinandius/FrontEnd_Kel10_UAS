import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";
import { getSiteSettings } from "../../../lib/content";

const fallback = (await getSiteSettings()).fallbackImage?.url ?? "";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { tags: true },
    orderBy: { id: "asc" },
  });

  return Response.json(products);
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return Response.json(
      { message: "Akses admin diperlukan." },
      { status: 403 }
    );
  }

  try {
    const {
      name,
      price,
      img,
      categoryId,
      tagIds,
      stock,
      maxStock,
    } = await request.json();

    const priceNum = Number(price);
    const stockNum = Number(stock);
    const maxStockNum = Number(maxStock);

    if (!name?.trim()) {
      return Response.json(
        { message: "Nama produk wajib diisi." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(priceNum) ||
      priceNum <= 0 ||
      priceNum > 2_000_000_000
    ) {
      return Response.json(
        { message: "Harga harus bilangan bulat lebih dari 0." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stockNum) ||
      !Number.isInteger(maxStockNum) ||
      stockNum < 0 ||
      maxStockNum < 0 ||
      stockNum > maxStockNum
    ) {
      return Response.json(
        { message: "Stok harus valid dan tidak boleh melebihi kapasitas maksimal." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: priceNum,
        img: img || fallback,
        stock: stockNum,
        maxStock: maxStockNum,
        categoryId: categoryId ? Number(categoryId) : null,
        tags: {
          connect: (tagIds ?? []).map((id: number) => ({ id })),
        },
      },
      include: { tags: true },
    });

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);

    return Response.json(
      { message: "Gagal menambahkan produk." },
      { status: 500 }
    );
  }
}