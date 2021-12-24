import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationtoTimeString } from "../util/convertDurationtoTimeString";
import styles from "./home.module.scss";
import Image from "next/image";
import Link from "next/link";

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
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
                <Image
                  width={120}
                  height={120}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`episode/${episode.id}`} prefetch>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationsAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódeo" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episodeos</h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`episode/${episode.id}`} prefetch>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationsAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
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
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationsAsString: convertDurationtoTimeString(
        Number(episode.file.duration)
      ),
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
