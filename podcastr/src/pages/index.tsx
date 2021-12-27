import { GetStaticProps } from "next";
import { api } from "../services/axios";

export default function Home() {
  return <h1>Testando</h1>;
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get("episodes");
  console.log(response);
  return {
    props: {},
  };
};
