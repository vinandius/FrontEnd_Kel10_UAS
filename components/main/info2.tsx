import styles from "../../app/page.module.css";
import { getSection } from "../../lib/content";
import { pad2, sectionLabel } from "../../lib/format";

export default async function Info2() {
    const section = await getSection("character");
    const traits = section.items.filter((item) => item.kind === "trait");

    return(
        <section id={styles["character-section"]}>

            <div className={styles["character-heading"]}>
                <div className={styles["section-label"]}>{sectionLabel(section)}</div>
                <h1> {section.title} </h1>
            </div>

            <div className={styles["character-list"]}>
                {traits.map((trait, index) => (
                    <div key={trait.id} className={styles["character-item"]}>
                        <span>{pad2(index + 1)}</span>

                        <div>
                            <h2>{trait.title}</h2>
                            <p> {trait.text} </p>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}