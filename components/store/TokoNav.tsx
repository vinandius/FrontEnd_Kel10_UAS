"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../app/page.module.css";
import type { NavItem } from "../../lib/types";
import { useAuth } from "./AuthProvider";

export default function TokoNav({ links }: { links: NavItem[] }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const loggedIn = user !== null;

  const visibleLinks = links.filter((item) => {
    if (item.visibility === "member") return loggedIn;
    if (item.visibility === "guest") return !loggedIn;
    return true;
  });

  return (
    <div id={styles["navigation"]}>
      <nav>
        {visibleLinks.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={pathname === item.path ? styles["active"] : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}