import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { setSessionCookie } from "./session";
import type { Session } from "./roles";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name || !email.includes("@") || password.length < 6) {
    return Response.json(
      {message: "Terjadi kesalahan"},
      {status: 400}
    )
  }

  const existUser = await prisma.user.findUnique({ where: { email } });
  if (existUser) {
    return Response.json({
      message: "Email sudah digunakan"
    }, {status: 400})
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10), role: "customer"
    }
  });

  const session: Session = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: "customer"
  }
  await setSessionCookie(session);

  return Response.json({message: "Akun telah berhasil dibuat"}, {status: 201});
}