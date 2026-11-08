import "../../styles/style.css";
import "../../styles/pages.css";
import "../../styles/annoyingStyle.css";
import { AuthProvider } from "@/components/store/AuthProvider";

export default function TokoLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}