import Link from "next/link";
import type { FooterData } from "../../lib/types";

export default function StoreFooter({ footer }: { footer: FooterData }) {
  return (
    <footer id="contact">
      <h2>{footer.heading}</h2>
      <div className="footer">
        <p>{footer.socialPrompt}</p>
        {footer.socials.map((social) => (
          <p key={social.id}>
            {social.iconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="social-icon" src={social.iconUrl} alt={social.iconAlt ?? ""} />
            )}
            <Link href={social.url} target="_blank" rel="noopener noreferrer">
              {social.label}
            </Link>
          </p>
        ))}
        <p>{footer.feedbackPrompt} {footer.email}</p>
      </div>
    </footer>
  );
}