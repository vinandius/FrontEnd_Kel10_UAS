import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const cookieName = "token";
const dayActive = 60 * 60 * 24 * 7;

export type Session = {
    userId: number;
    name: string;
    email: string;
    role: "admin" | "customer";
}

function getKey() {
    const key = process.env.JWT_SECRET;
    if (!key) throw new Error("JWT_SECRET belum ada.");
    return new TextEncoder().encode(key);
}

export async function signToken(user: Session): Promise<string> {
    return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId.toString())
    .setIssuedAt()
    .setExpirationTime(dayActive)
    .sign(getKey());
}

export async function verifyToken(token: string): Promise<Session | null> {
    try {
        const { payload } = await jwtVerify(token, getKey(), {
            algorithms: ["HS256"],
        });
        return {
            userId: Number(payload.sub),
            name: payload.name as string,
            email: payload.email as string,
            role: payload.role as "admin" | "customer",
        };
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

export async function setSessionCookie(user: Session) {
    const token = await signToken(user);
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: dayActive,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;
    if (!token) return null;
    return verifyToken(token);
}