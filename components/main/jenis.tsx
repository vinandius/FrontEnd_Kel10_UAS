"use client"

import { useState } from "react";
import styles from "../../app/page.module.css";
import RendangCard from "./rendang-card";

const rendangTypes = [
    {
        number: "01",
        title: "Rendang Sapi",
        image: "/Photos/Rendang%20Sapi.jpg",
        alt: "Rendang sapi",
        description:
            "Rendang berbahan daging sapi yang dimasak bersama santan dan rempah.",
    },
    {
        number: "02",
        title: "Rendang Ayam",
        image: "/Photos/Rendang%20Ayam.jpg",
        alt: "Rendang ayam",
        description:
            "Variasi rendang menggunakan daging ayam dengan bumbu rempah.",
    },
    {
        number: "03",
        title: "Rendang Itik",
        image: "/Photos/Rendang%20Itik.jpg",
        alt: "Rendang itik",
        description:
            "Olahan itik yang dimasak perlahan bersama bumbu rendang.",
    },
    {
        number: "04",
        title: "Rendang Paru",
        image: "/Photos/Rendang%20Paru.jpg",
        alt: "Rendang paru",
        description:
            "Variasi rendang yang menggunakan paru sebagai bahan utamanya.",
    },
    {
        number: "05",
        title: "Kalio",
        image: "/Photos/Kalio.jpg",
        alt: "Kalio",
        description:
            "Olahan bersantan dengan bumbu yang masih lebih basah daripada rendang kering.",
    },
];

export default function Jenis() {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredTypes = rendangTypes.filter((item)=>{
        const searchableText = `${item.title} ${item.description}`.toLowerCase();

        return searchableText.includes(searchTerm.trim().toLowerCase());
    });
    
    return(
        <section id={styles["types-section"]}>
            <div id={styles["jendang"]}>

                <div className={styles["section-label"]}> 07 · JENIS</div>
                <h1> Jenis Rendang</h1>

                <div className={styles["types-intro"]}>
                    <p> Rendang tidak hanya hadir dalam satu bentuk. Bahan dan daerah pengolahannya dapat menghasilkan variasi yang berbeda.</p>
                </div>

                <div className={styles["search-container"]}>
                    <input type="text" id={styles["searchProduct"]} className={styles["search-input"]} placeholder="Cari jenis rendang"
                    aria-label="Cari jenis rendang"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                {/* <!-- Gambar rendang --> */}
                <div id={styles["renlistcont"]}>
                    {filteredTypes.map((item) => (
                        <RendangCard key={item.number}
                        number={item.number}
                        title={item.title}
                        image={item.image}
                        alt={item.alt}>{item.description}</RendangCard>
                    ))}

                    {filteredTypes.length === 0 && (
                        <p>Jenis rendang tidak ditemukan.</p>
                    )}
                </div>
            </div>
        </section>
    );
}