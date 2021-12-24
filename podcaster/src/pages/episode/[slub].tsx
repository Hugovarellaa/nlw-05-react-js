import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";
import { convertDurationtoTimeString } from "../../util/convertDurationtoTimeString";

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

type EpisodeProps = {
  episodes: Episode[];
};

export default function Episode({ episodes }: EpisodeProps) {
  return (
    <>
      <h1>testando</h1>
    </>
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

  const data = await api.get(`/episode/${slug}`);

  // const episode = {
  //   id: data.id,
  //   title: data.title,
  //   thumbnail: data.thumbnail,
  //   members: data.members,
  //   publishedAt: format(parseISO(data.published_at), "d MMM yy", {
  //     locale: ptBR,
  //   }),
  //   duration: Number(data.file.duration),
  //   durationsAsString: convertDurationtoTimeString(Number(data.file.duration)),
  //   description: data.description,
  //   url: data.file.url,
  // };

  console.log(data);

  return {
    props: {
      // episode,
    },
    revalidate: 60 * 60 * 24, //24hours
  };
};
