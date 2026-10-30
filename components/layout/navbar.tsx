"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../app/page.module.css";

const navLinks = [
    {href: "/", label: "Home"},
    {href: "/home/asal-usul", label: "Asal"},
    {href: "/home/tentang-rendang", label: "About"},
    {href: "/home/proses", label: "Proses"},
    {href: "/home/resep", label: "Bahan"},
    {href: "/home/makna-rendang", label: "Makna"},
    {href: "/home/karakter-rendang", label: "Karakter"},
    {href: "/home/jenis-rendang", label: "Jenis"},
    {href: "/#contact", label: "Contact"},
    {href: "/store/store", label: "Toko"},
];

export default function Navbar(){
    const pathname = usePathname();
    if (pathname.startsWith("/store/")) return null;
    
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