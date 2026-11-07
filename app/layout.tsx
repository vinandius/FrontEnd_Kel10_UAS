import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import { getNavLinks, getSiteSettings } from "../lib/content";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { title: settings.metaTitle, description: settings.metaDescription };
}

export default async function RootLayout({children}: LayoutProps<"/">) {
  const [settings, navLinks] = await Promise.all([getSiteSettings(), getNavLinks("main")]);

  return (
    <html lang={settings.language} className={`${poppins.variable} ${playfairDisplay.variable}`}>
      <body>
        <Navbar links={navLinks.filter((link) => link.visibility === "all")} />
        {children}
      </body>
    </html>
  );
}
