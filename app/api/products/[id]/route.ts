import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/session";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) {
    return Response.json({ message: "Login dulu woy!" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return Response.json({ message: "Lu member apa gimana?" }, { status: 403 });
  }

  const id = Number((await params).id);
  const { name, price, img, categoryId, tagIds } = await request.json();

  if (price !== undefined && price !== null && price !== "") {
    const priceNum = Number(price);
    if (!Number.isInteger(priceNum) || priceNum <= 0 || priceNum > 2_000_000_000) {
      return Response.json(
        { message: "Harga harus bilangan bulat dan maksimal Rp 2.000.000.000." },
        { status: 400 }
      );
    }
  }

  const data: {
    name?: string; price?: number; img?: string;
    categoryId?: number | null; tags?: { set: { id: number }[] };
} = {};
  if (name?.trim()) data.name = name.trim();
  if (Number(price) > 0) data.price = Number(price);
  if (img) data.img = img;
  if (categoryId !== undefined) data.categoryId = categoryId ? Number(categoryId) : null;
  if (Array.isArray(tagIds)) data.tags = { set: tagIds.map((id: number) => ({ id })) };
  
  try {
    const product = await prisma.product.update({ where: { id }, data });
    return Response.json(product);
  } catch {
    return Response.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) {
    return Response.json({ message: "Login dulu woy!" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return Response.json({ message: "Lu member apa gimana?" }, { status: 403 });
  }

  const id = Number((await params).id);
  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ message: "Produk dihapus." });
  } catch {
    return Response.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }
}