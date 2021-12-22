import styles from "./styles.module.scss";
import ptBR from "date-fns/locale/pt-BR";
import format from "date-fns/format";

export function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMM", {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Logo" />
      <p>O melhor para voce ouvir, sempre</p>
      <time>{currentDate}</time>
    </header>
  );
}
