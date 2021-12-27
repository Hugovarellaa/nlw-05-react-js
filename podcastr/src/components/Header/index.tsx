import styles from "./styles.module.scss";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";

export function Header() {
  const currentDate = format(new Date(), "EEEEEE d MMM", { locale: ptBR });

  return (
    <header className={styles.headerContainer}>
      <Link href="/" passHref>
        <a>
          <img src="logo.svg" alt="logo" />
        </a>
      </Link>
      <p>O melhor para voce ouvir</p>
      <time>{currentDate}</time>
    </header>
  );
}
