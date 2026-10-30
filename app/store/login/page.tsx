"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!login(email.trim(), password)) {
      setMsg("Email atau password salah.");
      return;
    }
    router.push("/store/store");
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
        Belum punya akun? <Link href="/store/register">Daftar</Link> | <Link href="/store/store">Kembali</Link>
      </p>
    </main>
  );
}