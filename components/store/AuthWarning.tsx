import Link from "next/link";

type AuthWarningProps = { title: string; message: string; buttonLabel: string };

export default function AuthWarning({ title, message, buttonLabel }: AuthWarningProps) {
  return (
    <div className="auth-warning-overlay">
      <div className="auth-warning-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <Link href="/store/login" className="auth-warning-btn">
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}