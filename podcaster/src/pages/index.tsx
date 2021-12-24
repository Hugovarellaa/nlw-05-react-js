import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationtoTimeString } from "../util/convertDurationtoTimeString";
import styles from "./home.module.scss";

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
  members: string;
  durationsAsString: string;
  url: string;
  duration: string;
}
interface HomeProps {
  allEpisodes: Episode[];
  latesEpisodes: Episode[];
}

export default function Home({ allEpisodes, latesEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latesEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latesEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <img src={episode.thumbnail} alt={episode.title} />

                <div className={styles.episodeDetails}>
                  <a href={episode.url}>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationsAsString}</span>
                  </a>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódeo" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}></section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      member: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationsAsString: convertDurationtoTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latesEpisodes = episodes.splice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latesEpisodes,
    },
    revalidate: 60 * 60 * 24,
  };
};
