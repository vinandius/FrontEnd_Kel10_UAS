"use client";

import Link from "next/link";

export default function BackToTop({ label }: { label: string }) {
    return (
        <Link
            href="/"
            scroll={false}
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
        >
            {label}
        </Link>
    );
}