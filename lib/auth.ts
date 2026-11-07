type Result = { ok: true } | { ok: false; message: string };

async function post(url: string, body: unknown): Promise<Result> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, message: data.message ?? "Terjadi kesalahan." };
  } catch {
    return { ok: false, message: "Tidak dapat terhubung ke server." };
  }
}

export const login = (email: string, password: string) =>
  post("/api/auth/login", { email, password });

export const register = (name: string, email: string, password: string) =>
  post("/api/auth/register", { name, email, password });

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}