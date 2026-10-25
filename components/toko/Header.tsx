import styles from "../../app/page.module.css"

export default function Header() {
    return(
        <section id={styles["header-hero"]}>
            <div id={styles["intro"]}>
                <h1>TOKO RENDANG</h1>
            </div>

            <div id={styles["navigation"]}>
                <nav>
                    <a href="index.html">Home</a>
                    <a href="#jendang">Lists</a>
                    <a href="#contact">Contact</a>
                    <a href="cart.html">Keranjang</a>
                    <a href="login.html" id={styles["authLink"]}>Login</a>
                </nav>
            </div>

            <div id={styles["hero-image"]}>
                <img src="Photos/rendang-hero.jpg" alt="Rendang" className={styles["hero-img"]} />
            </div>
        </section>
    )
}