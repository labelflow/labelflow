import { Article } from "../connectors/strapi";

export type HomeProps = {
  previewArticles: Omit<Article, "content">[];
};

export async function getHomeStaticProps(): Promise<{
  props: { previewArticles: Omit<Article, "content">[] };
}> {
  return {
    props: { previewArticles: [] },
  };
}
