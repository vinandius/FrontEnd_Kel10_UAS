import Link from "next/link";
import styles from "../../app/page.module.css";
import { getSection, getTexts } from "../../lib/content";
import { sectionLabel, tx } from "../../lib/format";

export default async function Closing() {
    const [section, t] = await Promise.all([getSection("closing"), getTexts("closing")]);

    return(
        <section id={styles["closing-section"]}>

            <div className={styles["closing-text"]}>
                <div className={styles["section-label"]}>
                    {sectionLabel(section)}
                </div>
                <h1>{section.title}</h1>
                {section.description && <p>{section.description}</p>}
                <Link href={`#${styles["header-hero"]}`}>
                    {tx(t, "closing.backToTop")}
                </Link>
            </div>

        </section>
    )
}