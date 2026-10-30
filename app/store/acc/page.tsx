/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../../../lib/auth";
import { User } from "../../../lib/db";

export default function AccPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) router.replace("/store/login");
    else setUser(u);
  }, [router]);

  if (!user) return null;

  return (
    <main className="card">
      <h1>Akun saya</h1>
      <p>Nama: <strong>{user.name}</strong></p>
      <p>Email: <strong>{user.email}</strong></p>
      <p>Peran: <strong>{user.role === "admin" ? "Admin" : "Pembeli"}</strong></p>

      {user.role === "admin" && (
        <Link href="/store/admin" className="btn-add" style={{ textDecoration: "none", display: "inline-block" }}>
          Kelola produk
        </Link>
      )}
      <button
        className="btn-del"
        onClick={() => {
          logout();
          router.push("/store/store");
        }}
      >
        Log Out
      </button>

      <p className="alt"><Link href="/store/store">Kembali ke toko</Link></p>
    </main>
  );
}