import styles from "../../app/page.module.css";
import { getHero } from "../../lib/content";

export default async function Intro() {
    const hero = await getHero("home");

    return(
        <section id="intro">
            <section id={styles["header-hero"]}>
                <div id={styles["intro"]}>
                    {hero.eyebrow && <p className={styles["eyebrow"]}>{hero.eyebrow}</p>}
                    <h1>{hero.title}</h1>
                    {hero.subtitle && <p>{hero.subtitle}</p>}
                </div>

                <div id={styles["hero-image"]}>
                    <img src={hero.image.url} alt={hero.image.alt} className={styles["hero-img"]}/>
                    {(hero.badge || hero.tagline) && (
                        <div className={styles["hero-text"]}>
                            {hero.badge && <span>{hero.badge}</span>}
                            {hero.tagline && <strong>{hero.tagline}</strong>}
                        </div>
                    )}
                </div>
            </section>
        </section>
    )
}