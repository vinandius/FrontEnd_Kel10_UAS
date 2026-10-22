import styles from "../../app/page.module.css";

export default function Info1() {
    return(
        <section id={styles["culture-section"]} className={styles["editorial-section"]}>

            <div className={styles["section-header"]}>
                <p className={styles["section-number"]}>05 · MAKNA</p>
                <h2>Lebih dari sekadar hidangan.</h2>
            </div>


            <div className={styles["culture-grid"]}>

                <div className={styles["culture-card"]}>
                    <span>01</span>
                    <h3>Tradisi</h3>
                    <p> Rendang hadir dalam berbagai kegiatan dan tradisi masyarakat Minangkabau. </p>
                </div>

                <div className={styles["culture-card"]}>
                    <span>02</span>
                    <h3>Perjalanan</h3>
                    <p> Rendang dikenal sebagai makanan yang dapat bertahan lama sehingga sesuai dengan perjalanan masyarakat  Minangkabau. </p>
                </div>

                <div className={styles["culture-card"]}>
                    <span>03</span>
                    <h3>Warisan</h3>
                    <p> Pengetahuan tentang bahan dan cara memasak diteruskan dari satu generasi ke generasi berikutnya. </p>
                </div>
            </div>


            <div className={styles["quote-box"]}>
                <p> "Sebuah hidangan yang membutuhkan waktu, kesabaran, dan banyak rempah." </p>
            </div>

        </section>
    )
}