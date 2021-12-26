import styles from "./styles.module.scss";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";

export function Header() {
  const currentDate = format(new Date(), "EEEEEE d MMM", {
    locale: ptBR,
  });
  return (
    <>
      <header className={styles.container}>
        <img src="/logo.svg" alt="logo" />

        <p>O melhor para voce ouvir sempre</p>
        <time>{currentDate}</time>
      </header>
    </>
  );
}
