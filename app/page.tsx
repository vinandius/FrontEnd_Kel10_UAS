import type { JSX } from "react";
import styles from "./page.module.css";
import Intro from "../components/main/intro";
import Origin from "../components/main/origin";
import History from "../components/main/history";
import Proses from "../components/main/proses";
import Resep from "../components/main/resep";
import Info1 from "../components/main/info1";
import Info2 from "../components/main/info2";
import Jenis from "../components/main/jenis";
import Closing from "../components/main/closing";
import Footer from "../components/layout/footer";
import Scroll from "../components/ui/scroll";
import { getVisibleSectionKeys } from "../lib/content";

// kunci Section di database -> komponen. Urutan & tampil/tidak diatur tabel Section.
const SECTION_COMPONENTS: Record<string, () => Promise<JSX.Element>> = {
  origin: Origin,
  about: History,
  process: Proses,
  recipe: Resep,
  meaning: Info1,
  character: Info2,
  types: Jenis,
  closing: Closing,
};

export default async function Home() {
  const sectionKeys = await getVisibleSectionKeys();

  return (
      <main>
        <div id={styles["scroll-progress"]}/>
        <Intro />
        {sectionKeys.map((key) => {
          const Section = SECTION_COMPONENTS[key];
          return Section ? <Section key={key} /> : null;
        })}
        <Footer />
        <Scroll />
      </main>
  );
}