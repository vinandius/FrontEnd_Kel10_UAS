import styles from "../../app/page.module.css";

export default function Info1() {
    return(
        <section id={styles["about"]} className={styles["editorial-section"]}>
            <div id={styles["contfr"]}>
                <div id={styles["history"]}>
                    <div className={styles["section-label"]}>02 · MENGENAL RENDANG</div>
                    <h1>Apa sebenarnya rendang?</h1>
                    
                    <div className={styles["history-content"]}>
                        <div className={styles["history-img"]}>
                            <img className={styles["origin"]} src="/Photos/rendang.jpg" alt="Rendang"/>
                        </div>
                            <div className={styles["history-text"]}>
                                <p> Rendang merupakan masakan yang identik dengan masyarakat Minangkabau, Sumatera Barat. Hidangan ini dibuat dengan daging, santan, cabai, dan berbagai rempah yang dimasak dalam waktu lama.</p>
                                <p>Proses memasak yang panjang membuat cairan semakin berkurang hingga menghasilkan bumbu yang pekat dan melakat pada daging.</p>

                                <div className={styles["marandang-box"]}>
                                    <div className={styles["marandang-number"]}>01</div>

                                    <div>
                                        <h2>Marandang</h2>
                                        <p> Istilah "marandang" merujuk pada proses memasak santan dan bumbu secara perlahan hingga mengering dan menyusut.</p>
                                    </div>
                                </div>  
                            </div>
                
                    </div>
                </div>

            
            {/* <!-- Foto Rendang 1 --> */}
                <div id={styles["fr1"]}>

                    <div className={styles["fact-image"]}>
                        <img src="/Photos/rendang-hitam.jpeg" alt="Rendang berwarna gelap"/>
                    </div>

                    <div className={styles["fact-text"]}>
                        <span className={styles["fact-number"]}>01</span>

                        <h2> Semakin lama dimasak, semakin pekat. </h2>
                        <p> Rendang umumnya memiliki warna cokelat gelap hingga hitam pekat setelah dimasak dalam waktu lama. </p>
                    </div>

                </div>

                {/* <!-- Foto Rendang 2 --> */}
                <div id={styles["fr2"]}>
                    <div className={styles["fact-text"]}>
                        <span className={styles["fact-number"]}>02</span>
                        <h2> Sebelum menjadi rendang, ada kalio. </h2>
                        <p> Jika daging yang dimasak masih berwarna merah kecokelatan dan dimasak tidak sampai kering, masyarakat Minangkabau menyebutnya "Kalio". </p>
                    </div>

                    <div className={styles["fact-image"]}>
                        <img src="/Photos/kalio.jpeg" alt="Kalio dan rendang"/>
                    </div>

                </div>
                {/* <!-- Infografis --> */}
                <div className={styles["info-block"]}>

                    <div className={styles["info-image"]}>
                        <img src="/Photos/masak-rendang.jpg" alt="Rendang"/>
                    </div>

                    <div className={styles["info-text"]}>
                        <span>03</span>
                        <h2>Waktu menjadi bagian dari rasa.</h2>
                        <p> Proses memasak yang panjang membuat kuah semakin berkurang dan bumbu semakin menempel pada bahan. Perubahan inilah yang membuat rendang memiliki karakter yang berbeda dari masakan bersantan lainnya. </p>
                    </div>

                </div>
                {/* <!-- Infografis 2 --> */}
                <div className={styles["info-block"]}>

                    <div className={styles["info-text"]}>
                        <span>04</span>

                        <h2>Gelap bukan berarti gosong.</h2>

                        <p> Warna gelap pada rendang terbentuk dari proses memasak yang panjang dan perubahan warna bumbu selama cairan terus berkurang.</p>
                    </div>

                    <div className={styles["info-image"]}>
                        <img src="/Photos/rendang-hitam2.jpg" alt="Rendang gelap"/>
                    </div>

                </div>

            </div>

        </section>
    )
}