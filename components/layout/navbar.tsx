import Link from "next/link";
import styles from "../../app/page.module.css";

export default function Navbar(){
    return(
        <div id={styles["navigation"]}>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/asal-usul">Asal</Link>
                <Link href="/tentang-rendang">About</Link>
                <Link href="/proses">Proses</Link>
                <Link href="/resep">Bahan</Link>
                <Link href="/jenis-rendang">Jenis</Link>
                <Link href={`/#${styles["closing-section"]}`}>
                Contact
                </Link>
                <Link href="/store">Toko</Link>
            </nav>
        </div>
    );
}