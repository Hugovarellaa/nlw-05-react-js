import type { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { PayerProvider } from "../context/usePlayer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PayerProvider>
      <div className={styles.container}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PayerProvider>
  );
}

export default MyApp;
