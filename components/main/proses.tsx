import { Fragment } from "react";
import styles from "../../app/page.module.css";
import { getSection } from "../../lib/content";
import { pad2, sectionLabel } from "../../lib/format";

export default async function Proses() {
    const section = await getSection("process");
    const steps = section.items.filter((item) => item.kind === "step");

    return(
        <section id={styles["process-section"]}>

            <div className={styles["process-heading"]}>
                <h1>{section.title}</h1>
                {section.description && <p>{section.description}</p>}
            </div>

            <div className={styles["process"]}>
                {steps.map((step, index) => (
                    <Fragment key={step.id}>
                        {index > 0 && <div className={styles["process-line"]}></div>}
                        <div className={styles["process-item"]}>
                            <span>{pad2(index + 1)}</span>
                            <h2>{step.title}</h2>
                            <p>{step.text}</p>
                        </div>
                    </Fragment>
                ))}
            </div>
        </section>
    )
}