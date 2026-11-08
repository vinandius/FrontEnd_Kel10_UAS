import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";

const unauthorized = () => Response.json({ message: "Lu member apa gimana?" }, { status: 401 });

export async function GET() {
    const userRole = await getSession();
    if (!userRole) return unauthorized();
    const items = await prisma.cartItem.findMany({
        where: {userId: userRole.id},
        orderBy: {id: "asc"},
    });
    return Response.json(items.map((i) => ({ id: i.productId, qty: i.qty })));
}

export async function POST (request: Request) {
    const userRole = await getSession();
    if (!userRole) return unauthorized();
    const productId = Number((await request.json()).productId);
    try {
        await prisma.cartItem.upsert({
            where: { userId_productId: {userId: userRole.id, productId} },
            update: { qty: { increment: 1}},
            create: { userId: userRole.id, productId, qty: 1},
        });
        return Response.json({ ok: true });
    } catch {
        return Response.json({ message: "Produk ga ada bang"}, {status: 404});
    }
}

export async function PATCH (request: Request) {
    const userRole = await getSession();
    if (!userRole) return unauthorized();
    const { productId, qty } = await request.json();
    await prisma.cartItem.updateMany({
        where: {
            userId: userRole.id,
            productId: Number(productId) },
        data: {
            qty: Math.max(1, Math.floor(Number(qty)))  },
        });
    return Response.json({ ok: true });
}

export async function DELETE (request: Request) {
    const userRole = await getSession();
    if (!userRole) return unauthorized();
    const productId = new URL(request.url).searchParams.get("productId");
    await prisma.cartItem.deleteMany({
        where: productId ? {userId: userRole.id, productId: Number(productId) } : {userId: userRole.id},
    });
    return Response.json({ ok: true });
}