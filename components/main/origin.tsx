import styles from "../../app/page.module.css";
import { getSection, getTexts } from "../../lib/content";
import { sectionLabel, tx } from "../../lib/format";

export default async function Origin() {
    const [section, t] = await Promise.all([getSection("origin"), getTexts("origin")]);

    return(
        <section id={styles.origin} className={styles["editorial-section"]}>
            <div className={styles["section-heading"]}>
                <h2>{section.title}</h2>
            </div>

            <div className={styles["origin-layout"]}>
                <div className={styles["origin-visual"]}>
                    {section.image && (
                        <div className={styles["origin-img"]}>
                            <img src={section.image.url} alt={section.image.alt} />
                        </div>
                    )}

                    <div className={styles["origin-title"]}>
                        <p>{tx(t, "origin.badge.prefix")}</p>
                        <h3>{tx(t, "origin.badge.name")}</h3>
                        <span>{tx(t, "origin.badge.region")}</span>
                    </div>
                </div>

                <div className={styles["origin-text"]}>
                    {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.id} className={paragraph.kind === "lead" ? styles["lead"] : undefined}>
                            {paragraph.text}
                        </p>
                    ))}

                    <div className={styles["origin-location"]}>
                        <span>{tx(t, "origin.location.label")}</span>
                        <strong>{tx(t, "origin.location.value")}</strong>
                    </div>
                </div>
            </div>
        </section>
)}