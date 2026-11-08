import styles from "../../app/page.module.css";
import { getSection } from "../../lib/content";
import { pad2, sectionLabel } from "../../lib/format";

export default async function Info1() {
    const section = await getSection("meaning");
    const cards = section.items.filter((item) => item.kind === "card");
    const quote = section.paragraphs.find((paragraph) => paragraph.kind === "quote");

    return(
        <section id={styles["culture-section"]} className={styles["editorial-section"]}>

            <div className={styles["section-header"]}>
                <h2>{section.title}</h2>
            </div>

            <div className={styles["culture-grid"]}>
                {cards.map((card, index) => (
                    <div key={card.id} className={styles["culture-card"]}>
                        <span>{pad2(index + 1)}</span>
                        <h3>{card.title}</h3>
                        <p>{card.text}</p>
                    </div>
                ))}
            </div>

            {quote && (
                <div className={styles["quote-box"]}>
                    <p>{`"${quote.text}"`}</p>
                </div>
            )}

        </section>
    )
}