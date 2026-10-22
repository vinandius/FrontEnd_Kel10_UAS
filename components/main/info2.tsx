import styles from "../../app/page.module.css";

export default function Info2() {
    return(
        <section id={styles["character-section"]}>

            <div className={styles["character-heading"]}>
                <div className={styles["section-label"]}>06 · KARAKTER</div>
                <h1> Tiga hal yang membentuk karakter rendang. </h1>
            </div>

            <div className={styles["character-list"]}>

                <div className={styles["character-item"]}>
                    <span>01</span>

                    <div>
                        <h2>Rempah</h2>
                        <p> Memberikan aroma, warna, dan lapisan rasa. </p>
                    </div>
                </div>


                <div className={styles["character-item"]}>
                    <span>02</span>

                    <div>
                        <h2>Santan</h2>
                        <p> Menjadi bagian penting dari dasar masakan  dan membantu membentuk tekstur bumbu. </p>
                    </div>
                </div>


                <div className={styles["character-item"]}>
                    <span>03</span>

                    <div>
                        <h2>Waktu</h2>
                        <p> Mengubah cairan, tekstur, warna, dan kekuatan rasa selama proses memasak. </p>
                    </div>
                </div>

            </div>

        </section>
    )
}