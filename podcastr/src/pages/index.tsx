import { GetStaticProps, GetStaticPaths } from "next";
import { api } from "../services/axios";

export default function Home() {
  return (
    <>
      <h1>ola mundo</h1>
    </>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// };

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get("episodes");
  const data = await response.data;

  console.log(data);
  return {
    props: {},
  };
};
