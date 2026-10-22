import Image from "next/image";
import styles from "./page.module.css";
import Intro from "../components/main/intro";

export default function Home() {
  return (
      <main>
        <div id={styles.mainContainer}/>
        <Intro />
      </main>
  );
}
