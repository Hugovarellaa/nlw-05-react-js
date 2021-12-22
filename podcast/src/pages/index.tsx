import { GetStaticProps } from "next";

// interface Episode {
//   episodes: {
//     id: string;
//     title: string;
//     members: string;
//     published_at: string;
//     thumbnail: string;
//     description: string;
//   };
// }

export default function Home() {
  return (
    <>
      <h1>algo</h1>
    </>
  );
}

export const getStatcionProps: GetStaticProps = async () => {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();
  console.log(JSON.stringify(data));

  return {
    props: {
      episodes: data,
    },
  };
};
