import styles from "../../app/page.module.css";

export default function Proses() {
    return(
        <section id={styles["process-section"]}>

            <div className={styles["process-heading"]}>
                <div className={styles["section-label"]}> 03 · PROSES MASAK</div>
                <h1> Dari Gulai menjadi Rendang</h1>
                <p>Rendang tidak langsung menjadi kering. Proses memasaknya berkembang melalui perubahan tekstur dan jumlah cairan.</p>
            </div>

            <div className={styles["process"]}>
                
                <div className={styles["process-item"]}>
                    <span>01</span>
                    <h2>Gulai</h2>
                    <p>Santan masih banyak dan kuah masih relatif encer.</p>
                </div>

                <div className={styles["process-line"]}></div>

                <div className={styles["process-item"]}>
                    <span>02</span>
                    <h2>Kalio</h2>
                    <p>Cairan mulai berkurang dan bumbu menjadi semakin kental.</p>
                </div>

                <div className={styles["process-line"]}></div>

                <div className={styles["process-item"]}>
                    <span>03</span>
                    <h2>Rendang</h2>
                    <p> Cairan semakin menguap hingga menghasilkan bumbu yang pekat dan melekat pada bahan.</p>
                </div>
            </div>
        </section>
    )
}