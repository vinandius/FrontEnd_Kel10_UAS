"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../app/page.module.css";
import type { NavItem } from "../../lib/types";

export default function Navbar({ links }: { links: NavItem[] }){
    const pathname = usePathname();
    if (pathname.startsWith("/store/")) return null;

    return(
        <div id={styles["navigation"]}>
            <nav>
                {links.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={pathname === item.path ? styles["active"] : undefined}> {item.label} </Link>
                ))}
            </nav>
        </div>
    );
}