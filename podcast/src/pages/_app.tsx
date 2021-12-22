import { AppProps } from "next/app";

import { Header } from "../components/Header";
import { Play } from "../components/Play";

import styles from "../styles/app.module.scss";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Play />
    </div>
  );
}

export default MyApp;
