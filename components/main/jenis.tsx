import styles from "../../app/page.module.css";
import JenisSearch from "./jenis-search";
import { getRendangTypes, getSection, getTexts } from "../../lib/content";
import { pad2, sectionLabel, tx } from "../../lib/format";

export default async function Jenis() {
    const [section, types, t] = await Promise.all([
        getSection("types"),
        getRendangTypes(),
        getTexts("types"),
    ]);

    return(
        <section id={styles["types-section"]}>
            <div id={styles["jendang"]}>

                <div className={styles["section-label"]}> {sectionLabel(section)}</div>
                <h1> {section.title}</h1>

                {section.description && (
                    <div className={styles["types-intro"]}>
                        <p> {section.description}</p>
                    </div>
                )}

                <JenisSearch
                    placeholder={tx(t, "types.search.placeholder")}
                    emptyText={tx(t, "types.empty")}
                    cards={types.map((type, index) => ({
                        id: type.id,
                        number: pad2(index + 1),
                        title: type.title,
                        description: type.description,
                        image: type.image.url,
                        alt: type.image.alt,
                    }))}
                />
            </div>
        </section>
    );
}