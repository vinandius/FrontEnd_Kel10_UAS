import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { setSessionCookie } from "../../../../lib/session";
import type { Session } from "../../../../lib/types";

export async function POST (request: Request) {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!user || !valid) {
        return Response.json({ message: "Something went wrong" }, { status: 401 });
    }

    const session: Session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "admin" : "customer",
    };

    await setSessionCookie(session);
    return Response.json(session);
}