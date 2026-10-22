import styles from "../../app/page.module.css";

export default function Resep() {
    return(
        <section id={styles["recipe-section"]}>

        <div id={styles["recipecont"]}>

            <div id={styles["recipe"]}>

                <div className={styles["section-label"]}>
                    04 · BAHAN
                </div>

                <div className={styles["recipe-heading"]}>
                    <div>
                        <h1>Bukan cuma daging.</h1>
                        <h2>Karakter rendang dibangun dari rempah.</h2>
                    </div>

                    <p>
                        Pertemuan daging, santan, cabai, dan rempah
                        membentuk rasa yang menjadi ciri khas rendang.
                    </p>
                </div>


                {/* <!-- Bahan --> */}
                <div className={styles["ingredient-area"]}>

                    <div className={`${styles["ingredient-circle"]} ${styles["ingredient-cabai"]}`}>
                        <img src="/Photos/cabe.png" alt="Cabai"/>
                        <span>Cabai</span>
                    </div>

                    <div className={`${styles["ingredient-circle"]} ${styles["ingredient-jahe"]}`}>
                        <img src="/Photos/jahe.png" alt="Jahe"/>
                        <span>Jahe</span>
                    </div>

                    <div className={`${styles["ingredient-circle"]} ${styles["ingredient-lengkuas"]}`}>
                        <img src="/Photos/lengkuas.png" alt="Lengkuas"/>
                        <span>Lengkuas</span>
                    </div>

                    <div className={`${styles["ingredient-circle"]} ${styles["ingredient-santan"]}`}>
                        <img src="/Photos/santan.png" alt="Santan"/>
                        <span>Santan</span>
                    </div>

                    <div className={`${styles["ingredient-circle"]} ${styles["ingredient-daun"]}`}>
                        <img src="/Photos/daun.png" alt="Daun"/>
                        <span>Serai</span>
                    </div>

                    <div className={styles["ingredient-center"]}>
                        <span>RASA</span>
                        <strong>MINANG</strong>
                    </div>

                </div>


                <div className={styles["recipe-content"]}>

                    <div className={styles["recipe-image"]}>
                        <img src="/Photos/bumbu.png" alt="Bumbu dan rempah rendang"/>
                    </div>

                    <div className={styles["recipe-text"]}>

                        <span className={styles["recipe-small-title"]}> RASA YANG DIBANGUN BERSAMA </span>
                        <h2> Rempah, santan, dan waktu. </h2>
                        <p> Rendang menggunakan berbagai rempah yang menjadi bagian penting dari rasa dan aromanya. </p>

                        <div className={styles["ingredient-list"]}>
                            <div className={styles["ingredient"]}>
                                <span>01</span>
                                <strong>Daging</strong>
                            </div>

                            <div className={styles["ingredient"]}>
                                <span>02</span>
                                <strong>Santan</strong>
                            </div>

                            <div className={styles["ingredient"]}>
                                <span>03</span>
                                <strong>Cabai</strong>
                            </div>

                            <div className={styles["ingredient"]}>
                                <span>04</span>
                                <strong>Rempah</strong>
                            </div>

                        </div>

                        <p className={styles["ingredient-note"]}> Bumbu halus dapat meliputi bawang, cabai merah, jahe, kunyit, lengkuas, dan ketumbar. Rempah aromatiknya antara lain serai, daun salam, daun jeruk, dan daun kunyit.</p>

                    </div>

                </div>

            </div>

        </div>

    </section>
    )
}