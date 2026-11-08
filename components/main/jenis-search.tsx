"use client"

import { useState } from "react";
import styles from "../../app/page.module.css";
import RendangCard from "./rendang-card";

type JenisCard = {
    id: number;
    number: string;
    title: string;
    description: string;
    image: string;
    alt: string;
};

type JenisSearchProps = {
    cards: JenisCard[];
    placeholder: string;
    emptyText: string;
};

export default function JenisSearch({ cards, placeholder, emptyText }: JenisSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCards = cards.filter((item)=>{
        const searchableText = `${item.title} ${item.description}`.toLowerCase();

        return searchableText.includes(searchTerm.trim().toLowerCase());
    });

    return(
        <>
            <div className={styles["search-container"]}>
                <input type="text" id={styles["searchProduct"]} className={styles["search-input"]} placeholder={placeholder}
                aria-label={placeholder}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
            <div id={styles["renlistcont"]}>
                {filteredCards.map((item) => (
                    <RendangCard key={item.id}
                    number={item.number}
                    title={item.title}
                    image={item.image}
                    alt={item.alt}>{item.description}</RendangCard>
                ))}

                {filteredCards.length === 0 && (
                    <p>{emptyText}</p>
                )}
            </div>
        </>
    );
}