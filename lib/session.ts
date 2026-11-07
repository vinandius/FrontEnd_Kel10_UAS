import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari (detik)

export type SessionUser = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "customer";
};

function getKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET belum diatur di .env");
    return new TextEncoder().encode(secret);
}

// Membuat JWT dari data user
export async function signToken(user: SessionUser): Promise<string> {
    return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

// Memeriksa JWT. Kalau palsu atau kedaluwarsa, hasilnya null
export async function verifyToken(token: string): Promise<SessionUser | null> {
    try {
    const { payload } = await jwtVerify(token, getKey(), {
        algorithms: ["HS256"],
    });
    return {
        id: Number(payload.sub),
        name: payload.name as string,
        email: payload.email as string,
        role: payload.role as "admin" | "customer",
    };
    } catch {
    return null;
}
}

// Dipanggil setelah login/register berhasil
export async function setSessionCookie(user: SessionUser) {
    const token = await signToken(user);
    const store = await cookies();
    store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
    });
}

// Dipanggil saat logout
export async function clearSessionCookie() {
    const store = await cookies();
    store.delete(COOKIE_NAME);
}

// Membaca cookie lalu mengembalikan user yang sedang login (atau null)
export async function getSession(): Promise<SessionUser | null> {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}