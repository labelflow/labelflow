import { Box } from "@chakra-ui/react";
import * as React from "react";
import { getAllArticles, Article } from "../../connectors/strapi";
import { NavBar } from "../../components/website/Navbar/NavBar";
import { Footer } from "../../components/website/Footer/Footer";
import { Meta } from "../../components/meta";
import { ArticlesList } from "../../components/website/Blog/articles-list";
import { CookieBanner } from "../../components/cookie-banner";

export default function Posts({
  previewArticles,
}: {
  previewArticles: Omit<Article, "content">[];
}) {
  return (
    <>
      <Meta title="LabelFlow | Blog" />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <ArticlesList previewArticles={previewArticles} />
        <Footer />
      </Box>
    </>
  );
}

export async function getStaticProps(): Promise<{
  props: { previewArticles: Omit<Article, "content">[] };
}> {
  const previewArticles = (await getAllArticles({})) || [];
  return {
    props: { previewArticles },
  };
}
