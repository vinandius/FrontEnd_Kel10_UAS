import type { CSSProperties } from "react";
import styles from "../../app/page.module.css";
import { getSection, getTexts } from "../../lib/content";
import { pad2, sectionLabel, tx } from "../../lib/format";

// jumlah lingkaran yang punya posisi melayang di CSS (ingredient-pos-1 s/d 5); sisanya berbaris di bawah
const FLOATING_SLOTS = 5;

const accentStyle = (accent: string | null): CSSProperties | undefined =>
    accent ? { backgroundColor: `var(--${accent})` } : undefined;

export default async function Resep() {
    const [section, t] = await Promise.all([getSection("recipe"), getTexts("recipe")]);

    const bubbles = section.items.filter((item) => item.kind === "bubble");
    const floating = bubbles.slice(0, FLOATING_SLOTS);
    const overflow = bubbles.slice(FLOATING_SLOTS);
    const ingredients = section.items.filter((item) => item.kind === "ingredient");
    const note = section.paragraphs.find((paragraph) => paragraph.kind === "note");

    return(
        <section id={styles["recipe-section"]}>

        <div id={styles["recipecont"]}>

            <div id={styles["recipe"]}>

                <div className={styles["recipe-heading"]}>
                    <div>
                        <h1>{section.title}</h1>
                        {section.subtitle && <h2>{section.subtitle}</h2>}
                    </div>

                    {section.description && <p>{section.description}</p>}
                </div>

                <div className={styles["ingredient-area"]}>

                    {floating.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${styles["ingredient-circle"]} ${styles[`ingredient-pos-${index + 1}`]}`}
                            style={accentStyle(item.accent)}>
                            {item.image && <img src={item.image.url} alt={item.image.alt}/>}
                            <span>{item.title}</span>
                        </div>
                    ))}

                    <div className={styles["ingredient-center"]}>
                        <span>{tx(t, "recipe.center.top")}</span>
                        <strong>{tx(t, "recipe.center.bottom")}</strong>
                    </div>

                </div>

                {overflow.length > 0 && (
                    <div className={styles["ingredient-more"]}>
                        {overflow.map((item) => (
                            <div
                                key={item.id}
                                className={`${styles["ingredient-circle"]} ${styles["ingredient-circle-static"]}`}
                                style={accentStyle(item.accent)}>
                                {item.image && <img src={item.image.url} alt={item.image.alt}/>}
                                <span>{item.title}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles["recipe-content"]}>

                    {section.image && (
                        <div className={styles["recipe-image"]}>
                            <img src={section.image.url} alt={section.image.alt}/>
                        </div>
                    )}

                    <div className={styles["recipe-text"]}>

                        <span className={styles["recipe-small-title"]}> {tx(t, "recipe.side.label")} </span>
                        <h2> {tx(t, "recipe.side.title")} </h2>
                        <p> {tx(t, "recipe.side.description")} </p>

                        <div className={styles["ingredient-list"]}>
                            {ingredients.map((item, index) => (
                                <div key={item.id} className={styles["ingredient"]}>
                                    <span>{pad2(index + 1)}</span>
                                    <strong>{item.title}</strong>
                                </div>
                            ))}
                        </div>

                        {note && <p className={styles["ingredient-note"]}> {note.text}</p>}

                    </div>

                </div>

            </div>

        </div>

    </section>
    )
}