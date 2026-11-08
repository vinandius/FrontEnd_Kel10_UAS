"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../app/page.module.css";
import type { NavItem } from "../../lib/types";

export default function Navbar({ links }: { links: NavItem[] }) {
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);

    const homeItem = links.find((item) => item.path === "/");
    const aboutLinks = links.filter((item) =>
        item.path.startsWith("/home/")
    );
    const otherLinks = links.filter(
        (item) => item.path !== "/" && !item.path.startsWith("/home/")
    );

    const aboutActive = aboutLinks.some(
        (item) => pathname === item.path
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
                {homeItem && (
                    <Link
                        href={homeItem.path}
                        className={`${styles["mainNavLink"]} ${
                            pathname === "/" ? styles["mainNavActive"] : ""
                        }`}
                        onClick={closeMenus}
                    >
                        {homeItem.label}
                    </Link>
                )}

                {aboutLinks.length > 0 && (
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
                                        key={item.id}
                                        href={item.path}
                                        className={
                                            pathname === item.path
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
                )}

                {otherLinks.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={styles["mainNavLink"]}
                        onClick={closeMenus}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}