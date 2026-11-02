import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// 1. REGISTER: Hashes password and saves to Prisma DB
export async function register(name: string, email: string, password: string): Promise<boolean> {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return false;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "customer",
      },
    });

    return true;
  } catch (error) {
    alert("Registration error");
    return false;
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  } catch (error) {
    alert("Login error");
    return null;
  }
}
