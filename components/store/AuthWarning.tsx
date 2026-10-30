import Link from "next/link";

export default function AuthWarning({
  message = "Silakan masuk (login) terlebih dahulu untuk melanjutkan.",
}: {
  message?: string;
}) {
  return (
    <div className="auth-warning-overlay">
      <div className="auth-warning-box">
        <h3>Akses Ditolak</h3>
        <p>{message}</p>
        <Link href="/login" className="auth-warning-btn">
          Ke Halaman Login
        </Link>
      </div>
    </div>
  );
}