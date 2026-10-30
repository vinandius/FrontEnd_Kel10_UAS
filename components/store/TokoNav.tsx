"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/auth";
import styles from "../../app/page.module.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#jendang", label: "Lists" },
  { href: "#contact", label: "Contact" },
  { href: "/store/cart", label: "Keranjang" },
];

export default function TokoNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoggedIn(getCurrentUser() !== null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const links = [
    ...navLinks,
    loggedIn
      ? { href: "/store/acc", label: "Akun" }
      : { href: "/store/login", label: "Login" },
  ];

  return (
    <div id={styles["navigation"]}>
      <nav>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? styles["active"] : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}