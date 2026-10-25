import Link from "next/link";
import InfoPageLayout from "../../components/layout/info-page-layout";
import styles from "../page.module.css";

export default function StorePage() {
    return (
        <InfoPageLayout>
            <section id={styles["closing-section"]}>
                <div className={styles["closing-text"]}>
                    <div className={styles["section-label"]}>09 · TOKO</div>
                    <h1>Toko..., being develop.</h1>
                    <p>
                        Halaman toko sedang dibuat.
                        silakan browse page lain.
                    </p>
                    <Link href="/">Kembali</Link>
                </div>
            </section>
        </InfoPageLayout>
    );
}