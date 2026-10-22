import styles from "../../app/page.module.css";

export default function Footer() {
    return(
        <footer id="contact">
            <h2> Contact</h2>
            <div className={styles["footer"]}>
                <p>Kunjungi instagram kami!</p>
                <p>@instagramrendang</p>
                <p>Kritik dan saran? Silakan hubungi email kami: rendang@email.com</p>
            </div>
        </footer>
    )
}