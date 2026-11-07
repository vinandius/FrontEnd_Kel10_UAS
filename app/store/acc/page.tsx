/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "../../../lib/auth";
import { useAuth } from "@/components/store/AuthProvider";

export default function AccPage() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/store/login");
    }, [loading, user, router]);

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
        onClick={async () => {
          await logout();
          await refresh();
          router.push("/store/store");
        }}
      >
        Log Out
      </button>

      <p className="alt"><Link href="/store/store">Kembali ke toko</Link></p>
    </main>
  );
}