"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../../../lib/auth";
import { useAuth } from "@/components/store/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { refresh } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await login(email.trim(), password);
    if (!res.ok) {
      setMsg(res.message);
      return;
    }
    await refresh();
    router.push("/store");
  }

  return (
    <main className="card">
      <h1>Masuk</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" required value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <p className="msg">{msg}</p>
        <button type="submit" className="btn-add">Masuk</button>
      </form>
      <p className="alt">
        Belum punya akun? <Link href="/store/register">Daftar</Link> | <Link href="/store">Kembali</Link>
      </p>
    </main>
  );
}