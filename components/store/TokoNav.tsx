"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../app/page.module.css";
import type { NavItem } from "../../lib/types";
import { useAuth } from "./AuthProvider";
import { getCart } from "../../lib/cart";

export default function TokoNav({ links }: { links: NavItem[] }) {
    const pathname = usePathname();
    const { user } = useAuth();
    const loggedIn = user !== null;

    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        async function refreshCartCount() {
            const cart = await getCart();
            setCartCount(cart.reduce((total, item) => total + item.qty, 0));
        }

        refreshCartCount();
        window.addEventListener("cart-updated", refreshCartCount);
        window.addEventListener("focus", refreshCartCount);
        return () => {
            window.removeEventListener("cart-updated", refreshCartCount);
            window.removeEventListener("focus", refreshCartCount);
        };
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

    const visibleLinks = links.filter((item) => {
        if (item.visibility === "member") return loggedIn;
        if (item.visibility === "guest") return !loggedIn;
        return true;
    });

    function closeMenu() {
        setMenuOpen(false);
    }

    function getNavIcon(path: string) {
        if (path === "/store/cart") return "cart";
        if (path.includes("login") || path.includes("register")) return "user";
        if (path.includes("contact")) return "contact";
        if (path === "/store" || path === "/") return "home";
        return "list";
    }

    function StoreNavIcon({ type }: { type: string }) {
        const common = {
            width: 20,
            height: 20,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round" as const,
            strokeLinejoin: "round" as const,
            "aria-hidden": true,
        };

        if (type === "cart") {
            return <svg {...common}><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6" /></svg>;
        }
        if (type === "user") {
            return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
        }
        if (type === "contact") {
            return <svg {...common}><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z" /></svg>;
        }
        if (type === "list") {
            return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></svg>;
        }
        return <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></svg>;
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
                {visibleLinks.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={
                            pathname === item.path
                                ? styles["active"]
                                : undefined
                        }
                        onClick={closeMenu}
                    >
                        <span className={styles["storeNavIcon"]}>
                            <StoreNavIcon type={getNavIcon(item.path)} />
                        </span>
                        <span>{item.label}</span>
                        {item.path === "/store/cart" && cartCount > 0 && (
                            <span className={styles["cartBadge"]} aria-label={`${cartCount} produk di keranjang`}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

        </div>
    );
}