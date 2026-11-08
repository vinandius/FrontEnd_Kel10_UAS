"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "../../../lib/auth";
import { useAuth } from "@/components/store/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const refresh = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await register(name.trim(), email.trim(), password);
    if (!res.ok) {
      setMsg("Email sudah terdaftar.");
      return;
    }
    await refresh;
    alert("Pendaftaran berhasil. Silakan masuk.");
    router.push("/store");
  }

  return (
    <main className="card">
      <h1>Daftar</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nama</label>
        <input type="text" id="name" required value={name}
          onChange={(e) => setName(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password (minimal 6 karakter)</label>
        <input type="password" id="password" minLength={6} required value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <p className="msg">{msg}</p>
        <button type="submit" className="btn-add">Daftar</button>
      </form>
      <p className="alt">
        Sudah punya akun? <Link href="/store/login">Masuk</Link> | <Link href="/store">Kembali</Link>
      </p>
    </main>
  );
}