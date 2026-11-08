import Link from "next/link";
import styles from "../../app/page.module.css";
import { getFooterData } from "../../lib/content";

export default async function Footer() {
    const footer = await getFooterData();

    return(
        <footer id="contact" className={styles["footer-section"]}>
            <h2>{footer.heading}</h2>
            <div className={styles["footer"]}>
                <p>{footer.socialPrompt}</p>
                {footer.socials.map((social) => (
                    <p key={social.id} className={styles["social-row"]}>
                        {social.iconUrl && (
                            <img className={styles["social-icon"]} src={social.iconUrl} alt={social.iconAlt ?? ""} />
                        )}
                        <Link href={social.url} target="_blank" rel="noopener noreferrer">{social.label}</Link>
                    </p>
                ))}
                <p>{footer.feedbackPrompt} {footer.email}</p>
            </div>
        </footer>
    )
}