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

export default function Home() {
  return (
      <main>
        <div id={styles["scroll-progress"]}/>
        <Intro />
        <Origin />
        <History />
        <Proses />
        <Resep />
        <Info1 />
        <Info2 />
        <Jenis />
        <Closing />
        <Footer />
        <Scroll />
      </main>
  );
}
