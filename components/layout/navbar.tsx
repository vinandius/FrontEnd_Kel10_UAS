"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../app/page.module.css";

const navLinks = [
    {href: "/", label: "Home"},
    {href: "/asal-usul", label: "Asal"},
    {href: "/tentang-rendang", label: "About"},
    {href: "/proses", label: "Proses"},
    {href: "/resep", label: "Bahan"},
    {href: "/makna-rendang", label: "Makna"},
    {href: "/karakter-rendang", label: "Karakter"},
    {href: "/jenis-rendang", label: "Jenis"},
    {href: "/#contact", label: "Contact"},
    {href: "/store", label: "Toko"},
];

export default function Navbar(){
    const pathname = usePathname();

    return(
        <div id={styles["navigation"]}>
            <nav>
                {navLinks.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={pathname === item.href ? styles["active"] : undefined}> {item.label} </Link>
                ))}
            </nav>
        </div>
    );
}