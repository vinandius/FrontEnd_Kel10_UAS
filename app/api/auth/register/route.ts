import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { setSessionCookie } from "../../../../lib/session";
import type { Session } from "../../../../lib/types";

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!name || !email.includes("@") || password.length < 6) {
    return Response.json(
        { message: "Data tidak valid. Password minimal 6 karakter." },
        { status: 400 }
    );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
    return Response.json({ message: "Email sudah terdaftar." }, { status: 409 });
    }

    const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10), role: "customer" },
    });

    const session: Session = { id: user.id, name: user.name, email: user.email, role: "customer" };
    await setSessionCookie(session);
    return Response.json(session, { status: 201 });
}