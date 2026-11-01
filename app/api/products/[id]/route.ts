import { prisma } from "../../../../lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const id = Number((await params).id);
  const { name, price, img } = await request.json();

  const data: { name?: string; price?: number; img?: string } = {};
  if (name?.trim()) data.name = name.trim();
  if (Number(price) > 0) data.price = Number(price);
  if (img) data.img = img;

  try {
    const product = await prisma.product.update({ where: { id }, data });
    return Response.json(product);
  } catch {
    return Response.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number((await params).id);
  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ message: "Produk dihapus." });
  } catch {
    return Response.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }
}