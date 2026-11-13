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
                        {item.label}
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