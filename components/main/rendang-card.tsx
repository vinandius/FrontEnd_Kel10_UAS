import type { ReactNode} from "react";
import styles from "../../app/page.module.css";

type RendangCardProps = {
    number: string;
    title: string;
    image: string;
    alt: string;
    children: ReactNode;
};

export default function RendangCard({
    number,
    title,
    image,
    alt,
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
            </div>
        </article>
    )
}