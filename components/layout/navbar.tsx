"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../app/page.module.css";

const aboutLinks = [
    { href: "/home/asal-usul", label: "Asal-usul" },
    { href: "/home/tentang-rendang", label: "Tentang Rendang" },
    { href: "/home/proses", label: "Proses" },
    { href: "/home/resep", label: "Bahan dan Resep" },
    { href: "/home/makna-rendang", label: "Makna" },
    { href: "/home/karakter-rendang", label: "Karakter" },
    { href: "/home/jenis-rendang", label: "Jenis" },
];

export default function Navbar() {
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);

    const aboutActive = aboutLinks.some(
        (item) => pathname === item.href
    );

    function closeMenus() {
        setMobileOpen(false);
        setAboutOpen(false);
    }

    // Menutup menu ketika klik di luar Navbar atau menekan Escape.
    useEffect(() => {
        const navElement = document.getElementById(
            styles["mainNavigation"]
        );

        function handleOutsideClick(event: PointerEvent) {
            if (
                navElement &&
                event.target instanceof Node &&
                !navElement.contains(event.target)
            ) {
                closeMenus();
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                closeMenus();
            }
        }

        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Menutup menu ketika halaman berubah.
    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        setMobileOpen(false);
        setAboutOpen(false);
    }, [pathname]);

    //navbar main
    if (
        pathname === "/store" ||
        pathname.startsWith("/store/")
    ) {
        return null;
    }

    return (
        <div id={styles["mainNavigation"]}>

            <div className={styles["mainNavTop"]}>
                <button
                    type="button"
                    className={styles["mobileMenuButton"]}
                    aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                    aria-expanded={mobileOpen}
                    aria-controls="main-nav-links"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <span className={styles["mobileMenuIcon"]}>
                        <span />
                        <span />
                        <span />
                    </span>

                    <span>
                        {mobileOpen ? "Tutup" : "Menu"}
                    </span>
                </button>
            </div>

            <nav
                id="main-nav-links"
                className={`${styles["mainNavLinks"]} ${
                    mobileOpen ? styles["mainNavLinksOpen"] : ""
                }`}
                aria-label="Navigasi utama"
            >
                <Link
                    href="/"
                    className={`${styles["mainNavLink"]} ${
                        pathname === "/" ? styles["mainNavActive"] : ""
                    }`}
                    onClick={closeMenus}
                >
                    Home
                </Link>

                <div className={styles["mainNavDropdown"]}>
                    <button
                        type="button"
                        className={`${styles["mainNavDropdownButton"]} ${
                            aboutActive ? styles["mainNavActive"] : ""
                        }`}
                        aria-expanded={aboutOpen}
                        aria-haspopup="true"
                        aria-controls="about-nav-links"
                        onClick={() => setAboutOpen(!aboutOpen)}
                    >
                        Tentang Rendang

                        <span
                            className={`${styles["mainNavChevron"]} ${
                                aboutOpen
                                    ? styles["mainNavChevronOpen"]
                                    : ""
                            }`}
                        />
                    </button>

                    {aboutOpen && (
                        <div
                            id="about-nav-links"
                            className={styles["mainNavDropdownMenu"]}
                        >
                            {aboutLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        pathname === item.href
                                            ? styles["mainNavActive"]
                                            : ""
                                    }
                                    onClick={closeMenus}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Link
                    href="/#contact"
                    className={styles["mainNavLink"]}
                    onClick={closeMenus}
                >
                    Contact
                </Link>

                <Link
                    href="/store"
                    className={styles["mainNavLink"]}
                    onClick={closeMenus}
                >
                    Toko
                </Link>
            </nav>
        </div>
    );
}
