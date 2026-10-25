import styles from "../../app/page.module.css";

export default function Listrendang() {
    return(
        <section id={styles["listrendang"]}>
            <div id={styles["containerrendang"]}>
                <div className={styles["product-card"]}>
                    <img src="/Photos/Rendang Sapi.jpg" alt="Rendang Sapi" className={styles["img-responsive"]} />
                    <p>Rendang Sapi</p>
                    {/* <!-- Details about the product --> */}
                    <button id={styles["rendang-sapi"]} className={styles["btn-secondary"] + " " + styles["btn-detail"]}>Learn more</button>
                    <div id={styles["info-rendang-sapi"]} className={styles["info-rendang"]} style={{ display: "none" }}>
                        <strong className={styles["harga-text"]}></strong>
                        <p className={styles["deskripsi-text"]}></p>
                    </div>
                </div>

                <div className={styles["product-card"]}>
                    <img src="/Photos/Rendang Ayam.jpg" alt="Rendang Ayam" className={styles["img-responsive"]} />
                    <p>Rendang Ayam</p>
                    <button id={styles["rendang-ayam"]} className={styles["btn-secondary"] + " " + styles["btn-detail"]}>Learn more</button>
                    <div id={styles["info-rendang-ayam"]} className={styles["info-rendang"]} style={{ display: "none" }}>
                        <strong className={styles["harga-text"]}></strong>
                        <p className={styles["deskripsi-text"]}></p>
                    </div>
                </div>

                <div className={styles["product-card"]}>
                    <img src="/Photos/Rendang Itik.jpg" alt="Rendang Itik" className={styles["img-responsive"]} />
                    <p>Rendang Itik</p>
                    <button id={styles["rendang-itik"]} className={styles["btn-secondary"] + " " + styles["btn-detail"]}>Learn more</button>
                    <div id={styles["info-rendang-itik"]} className={styles["info-rendang"]} style={{ display: "none" }}>
                        <strong className={styles["harga-text"]}></strong>
                        <p className={styles["deskripsi-text"]}></p>
                    </div>
                </div>

                <div className={styles["product-card"]}>
                    <img src="/Photos/Kalio.jpg" alt="Kalio" className={styles["img-responsive"]} />
                    <p>Kalio</p>
                    <button id={styles["rendang-kalio"]} className={styles["btn-secondary"] + " " + styles["btn-detail"]}>Learn more</button>
                    <div id={styles["info-rendang-kalio"]} className={styles["info-rendang"]} style={{ display: "none" }}>
                        <strong className={styles["harga-text"]}></strong>
                        <p className={styles["deskripsi-text"]}></p>
                    </div>
                </div>

                <div className={styles["product-card"]}>
                    <img src="/Photos/Rendang Paru.jpg" alt="Rendang Paru" className={styles["img-responsive"]} />
                    <p>Rendang paru</p>
                    <button id={styles["rendang-paru"]} className={styles["btn-secondary"] + " " + styles["btn-detail"]}>Learn more</button>
                    <div id={styles["info-rendang-paru"]} className={styles["info-rendang"]} style={{ display: "none" }}>
                        <strong className={styles["harga-text"]}></strong>
                        <p className={styles["deskripsi-text"]}></p>
                    </div>
                </div>
            </div>
        </section>
    )
}