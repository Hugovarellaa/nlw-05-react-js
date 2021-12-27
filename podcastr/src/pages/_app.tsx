import type { AppProps } from "next/app";
import { Header } from "../Header";
import { Player } from "../Player";
import "../styles/global.scss";
import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.container}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  );
}

export default MyApp;