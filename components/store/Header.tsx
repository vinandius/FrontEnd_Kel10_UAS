import styles from "../../app/page.module.css"
import Link from "next/link";

export default function Header() {
    return(
        <section id={styles["header-hero"]}>
            <div id={styles["storetitle"]}>
                <h1>Our Store!</h1>
            </div>

            <div id={styles["nav"]}>
                <nav>
                    <Link href="/">Kembali</Link>
                </nav>
            </div>
        </section>
    )
}