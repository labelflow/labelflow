import { Article, getAllArticles } from "../connectors/strapi";

export type HomeProps = {
  previewArticles: Omit<Article, "content">[];
};

export async function getHomeStaticProps(): Promise<{
  props: { previewArticles: Omit<Article, "content">[] };
}> {
  const previewArticles = (await getAllArticles({ limit: 3 })) || [];
  return {
    props: { previewArticles },
  };
}
