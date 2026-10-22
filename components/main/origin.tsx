import styles from "../../app/page.module.css";

export default function Origin() {
    return(
        <section id={styles.origin} className={styles["editorial-section"]}>
            <div className={styles["section-heading"]}>
                <p className={styles["section-number"]}>01 · ASAL-USUL</p>
                <h2>Berawal dari Minangkabau</h2>
            </div>

            <div className={styles["origin-layout"]}>
                <div className={styles["origin-visual"]}>
                    <div className={styles["origin-img"]}>
                        <img src="/Photos/minangkabau.jpg" alt="Minangkabau, Sumatera Barat" />
                    </div>

                    <div className={styles["origin-title"]}>
                        <p>DARI</p>
                        <h3>MINANGKABAU</h3>
                        <span>Sumatera Barat</span>
                    </div>
                </div>

                <div className={styles["origin-text"]}>
                    <p className={styles["lead"]}> Rendang merupakan masakan tradisional yang identik dengan masyarakat Minangkabau, Sumatera Barat.</p>
                    <p>Rendang berkembang dalam tradisi kuliner Minangkabau dan menjadi bagian dari kehidupan masyarakatnya. Dari wilayah inilah rendang kemudian dikenal luas sebagai salah satu masakan Indonesia.</p>

                    <div className={styles["origin-location"]}>
                        <span>ASAL</span>
                        <strong>Minangkabau, Sumatera Barat</strong>
                    </div>
                </div>
            </div>
        </section>
)}