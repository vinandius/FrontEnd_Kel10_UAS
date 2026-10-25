import Link from "next/link";
import styles from "../../app/page.module.css";

export default function Closing() {
    return(
        <section id={styles["closing-section"]}>

            <div className={styles["closing-text"]}>
                <div className={styles["section-label"]}>
                    08 · PENUTUP
                </div>
                <h1>
                    Dari tanah Minangkabau,
                    lahir rasa yang panjang ceritanya.
                </h1>
                <p>
                    Rendang membawa lebih dari sekadar rasa.
                    Di balik rempah dan waktu, ada tradisi yang
                    terus diwariskan.
                </p>
                <Link href={`#${styles["header-hero"]}`}>
                    Kembali ke atas ↑
                </Link>
            </div>

        </section>
    )
}