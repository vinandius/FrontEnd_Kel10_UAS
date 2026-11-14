import type { ReactNode } from "react";
import styles from "../../app/page.module.css";

type RendangCardProps = {
    number: string;
    title: string;
    image: string;
    alt: string;
    tags: string[];
    children: ReactNode;
};

export default function RendangCard({
    number,
    title,
    image,
    alt,
    tags,
    children,
}: RendangCardProps) {
    return (
        <article className={styles["renlist"]}>
            <img src={image} alt={alt} />

            <div>
                <span className={styles["ren-number"]}>
                    {number}
                </span>

                <p>{title}</p>

                <small>{children}</small>

                <div className="tag-list">
                    {tags.map((t) => (
                        <span key={t} className="tag-chip">{t}</span>
                    ))}
                </div>
            </div>
        </article>
    )
}