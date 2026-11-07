import styles from "../../app/page.module.css";
import { getSection } from "../../lib/content";
import { pad2, sectionLabel } from "../../lib/format";

export default async function History() {
    const section = await getSection("about");
    const highlights = section.items.filter((item) => item.kind === "highlight");
    const facts = section.items.filter((item) => item.kind === "fact" || item.kind === "info");

    return(
        <section id={styles["about"]} className={styles["editorial-section"]}>

            <div id={styles["contfr"]}>
                <div id={styles["history"]}>
                    <div className={styles["section-label"]}>{sectionLabel(section)}</div>
                    <h1>{section.title}</h1>
                    <div className={styles["history-content"]}>
                        {section.image && (
                            <div className={styles["history-img"]}>
                                <img className={styles["origin"]} src={section.image.url} alt={section.image.alt}/>
                            </div>
                        )}

                        <div className={styles["history-text"]}>
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph.id}>{paragraph.text}</p>
                            ))}
                            {highlights.map((item, index) => (
                                <div key={item.id} className={styles["marandang-box"]}>
                                    <div className={styles["marandang-number"]}>{pad2(index + 1)}</div>
                                    <div>
                                        <h2>{item.title}</h2>
                                        <p>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {facts.map((item, index) => {
                    const number = pad2(index + 1);
                    const imageFirst = index % 2 === 0;

                    if (item.kind === "fact") {
                        const image = item.image && (
                            <div className={styles["fact-image"]}>
                                <img src={item.image.url} alt={item.image.alt}/>
                            </div>
                        );
                        const text = (
                            <div className={styles["fact-text"]}>
                                <span className={styles["fact-number"]}>{number}</span>
                                <h2>{item.title}</h2>
                                <p>{item.text}</p>
                            </div>
                        );
                        return (
                            <div key={item.id} className={styles["fact-row"]}>
                                {imageFirst ? <>{image}{text}</> : <>{text}{image}</>}
                            </div>
                        );
                    }

                    const image = item.image && (
                        <div className={styles["info-image"]}>
                            <img src={item.image.url} alt={item.image.alt}/>
                        </div>
                    );
                    const text = (
                        <div className={styles["info-text"]}>
                            <span>{number}</span>
                            <h2>{item.title}</h2>
                            <p>{item.text}</p>
                        </div>
                    );
                    return (
                        <div key={item.id} className={styles["info-block"]}>
                            {imageFirst ? <>{image}{text}</> : <>{text}{image}</>}
                        </div>
                    );
                })}
            </div>

        </section>
    )
}