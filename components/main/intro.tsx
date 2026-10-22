import Link from "next/link";

import styles from "../../app/page.module.css"

export default function Intro() {
    return(
        <section id={styles["header-hero"]}>
            <div id={styles["intro"]}>
                <p className={styles["eyebrow"]}>WARISAN KULINER NUSANTARA</p>
                <h1>RENDANG</h1>
                <p>Dari Minangkabau, Sumatera barat</p>
            </div>
    
            <div id={styles["navigation"]}>
                <nav>
                    <a href="#header-hero">Home</a>
                    <a href="#origin">Asal</a>
                    <a href="#about">About</a>
                    <a href="#process-section">Proses</a>
                    <a href="#recipe-section">Bahan</a>
                    <a href="#jendang">Jenis</a>
                    <a href="#closing-section">Contact</a>
                    <a href="toko.html">Toko</a>
                </nav>
            </div>

            <div id={styles["hero-image"]}>
                <img src="/Photos/rendang-hero.jpg" alt="Rendang" className={styles["hero-img"]}/>
                <div className={styles["hero-text"]}>
                    <span>MINANGKABAU</span>
                    <strong>Rasa yang lahir dari waktu ke waktu.</strong>
                </div>
            </div>
        </section>
    )
}