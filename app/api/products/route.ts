import { prisma } from "../../../lib/prisma";
import {getSession} from "../../../lib/session";
import {getSiteSettings} from "../../../lib/content";

type Context = { params: Promise<{id: string }> }

const fallback = (await getSiteSettings()).fallbackImage?.url ?? "";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return Response.json(products);
}

export async function POST(request: Request) {
  const { name, price, img } = await request.json();

  const session = await getSession();

  if(session?.role !== "admin") {
    return Response.json({message: "Lu member apa gimana?"}, {status: 401});
  }

  if (!name?.trim() || !(Number(price) > 0)) {
    return Response.json(
      { message: "Nama dan harga (lebih dari 0) wajib diisi." },
      { status: 400 }
    );
  }

  const priceNum = Number(price);
  if (!Number.isInteger(priceNum) || priceNum > 2_000_000_000) {
    return Response.json(
      { message: "Max 2.000.000 ya bang :)" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      price: Number(price),
      img: img || fallback,
    },
  });
  return Response.json(product, { status: 201 });

}