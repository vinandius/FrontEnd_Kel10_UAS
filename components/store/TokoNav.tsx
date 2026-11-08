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
    const [menuOpen, setMenuOpen] = useState(false);

    // Mengecek status login dari localStorage.
    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        setLoggedIn(getCurrentUser() !== null);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const links = [
        ...navLinks,
        loggedIn
            ? { href: "/store/acc", label: "Akun" }
            : { href: "/store/login", label: "Login" },
    ];

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <div id={styles["navigation"]}>

            {/* Tombol hamburger untuk mobile */}
            <div className={styles["storeNavMobileHeader"]}>
                <button
                    type="button"
                    className={styles["storeNavToggle"]}
                    aria-label={
                        menuOpen
                            ? "Tutup navigasi toko"
                            : "Buka navigasi toko"
                    }
                    aria-expanded={menuOpen}
                    aria-controls="store-nav-links"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className={styles["storeNavMenuIcon"]}>
                        <span />
                        <span />
                        <span />
                    </span>

                    <span>
                        {menuOpen ? "Tutup" : "Menu"}
                    </span>
                </button>
            </div>

            {/* Daftar navigasi toko */}
            <nav
                id="store-nav-links"
                className={`${styles["storeNavLinks"]} ${
                    menuOpen ? styles["storeNavLinksOpen"] : ""
                }`}
                aria-label="Navigasi toko"
            >
                {links.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={
                            pathname === item.href
                                ? styles["active"]
                                : undefined
                        }
                        onClick={closeMenu}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

        </div>
    );
}
