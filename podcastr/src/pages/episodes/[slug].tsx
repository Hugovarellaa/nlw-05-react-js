/* eslint-disable jsx-a11y/alt-text */
import ptBR from "date-fns/locale/pt-BR";
import format from "date-fns/format";
import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/axios";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { parseISO } from "date-fns";
import styles from "./episode.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../context/usePlayer";
import Head from "next/head";

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: number;
  url: string;
  publishedAt: string;
  description: string;
};

interface EpisodesProps {
  episodes: Episodes;
}

export default function Episode({ episodes }: EpisodesProps) {
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episodes.title} | Podcast</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href={"/"} passHref>
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          src={episodes.thumbnail}
          width={700}
          height={160}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episodes)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episodes.title}</h1>
        <span>{episodes.members}</span>
        <span>{episodes.publishedAt}</span>
        <span>{episodes.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episodes.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episodes = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: data.file.duration,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: { episodes },
    revalidate: 60 * 60 * 24, //24hours
  };
};
