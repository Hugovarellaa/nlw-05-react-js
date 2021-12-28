import { GetStaticProps } from "next";
import { api } from "../services/axios";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from "./home.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../context/usePlayer";
import Head from "next/head";

type Episodes = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  duration: number;
  durationAsString: number;
};
interface HomeProps {
  allEpisodes: Episodes[];
  latesEpisodes: Episodes[];
}

export default function Home({ allEpisodes, latesEpisodes }: HomeProps) {
  const { playList } = usePlayer();
  const episodeList = [...latesEpisodes, ...allEpisodes];

  return (
    <>
      <Head>
        <title>Home | Podcast</title>
      </Head>
      <div className={styles.container}>
        <section className={styles.latesEpisodes}>
          <h2>Ultimos lançamentos</h2>
          <ul>
            {latesEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <Image
                    width={192}
                    height={192}
                    objectFit="cover"
                    src={episode.thumbnail}
                    alt={episode.title}
                  />
                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => playList(episodeList, index)}
                  >
                    <img src="/play-green.svg" alt="Tocar episodio" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        objectFit="cover"
                        src={episode.thumbnail}
                        alt={episode.title}
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          playList(episodeList, index + latesEpisodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="Tocar episodio" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/episodes", {
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
      members: episode.members,
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
    };
  });

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
  };
};
