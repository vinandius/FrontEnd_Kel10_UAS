import styles from "../../app/page.module.css";

export default function Jenis() {
    return(
        <section id={styles["types-section"]}>
            <div id={styles["jendang"]}>

                <div className={styles["section-label"]}> 07 · JENIS</div>
                <h1> Jenis Rendang</h1>

                <div className={styles["types-intro"]}>
                    <p> Rendang tidak hanya hadir dalam satu bentuk. Bahan dan daerah pengolahannya dapat menghasilkan variasi yang berbeda.</p>
                </div>

                <div className={styles["search-container"]}>
                    <input type="text" id={styles["searchProduct"]} className={styles["search-input"]} placeholder="Cari jenis rendang"/>
                </div>
                {/* <!-- Gambar rendang --> */}
                <div id={styles["renlistcont"]}>
                </div>
            </div>
        </section>
)}