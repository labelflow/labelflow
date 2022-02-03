import { Box } from "@chakra-ui/react";
import * as React from "react";
import { Announcements } from "../components/announcements";
import { CookieBanner } from "../components/cookie-banner";
import { Meta } from "../components/meta";
import { ServiceWorkerManagerBackground } from "../components/service-worker-manager";
import { Banner } from "../components/website/banner";
import { ArticlesList } from "../components/website/Blog/articles-list";
import { Features } from "../components/website/Features/Features";
import { Footer } from "../components/website/Footer/Footer";
import { Hero } from "../components/website/Hero/Hero";
import { LogoGrid } from "../components/website/Logos/LogoGrid";
import { NavBar } from "../components/website/Navbar/NavBar";
import { Pricing } from "../components/website/Pricing/Pricing";
import { Proof } from "../components/website/proof";
import { Roadmap } from "../components/website/roadmap/roadmap";
import { Why } from "../components/website/Why/Why";
import { Article, getAllArticles } from "../connectors/strapi";

/** List of labels used to filter the announcements shown in /website */
const ANNOUNCEKIT_WEBSITE_LABELS = ["announcement"];

export default function Website({
  previewArticles,
}: {
  previewArticles: Omit<Article, "content">[];
}) {
  return (
    <>
      <ServiceWorkerManagerBackground />
      <Meta title="LabelFlow: The open standard platform for image labeling." />
      <CookieBanner />
      <Announcements labels={ANNOUNCEKIT_WEBSITE_LABELS} />
      <Box minH="640px">
        <NavBar />
        <Hero />
        <Banner />
        <Features />
        <Proof />
        <Why />
        <LogoGrid />
        <Roadmap />
        {/* <Testimonials /> */}
        <Pricing />
        <ArticlesList preview previewArticles={previewArticles} />
        <Footer />
      </Box>
    </>
  );
}

export async function getStaticProps(): Promise<{
  props: { previewArticles: Omit<Article, "content">[] };
}> {
  const previewArticles = (await getAllArticles({ limit: 3 })) || [];
  return {
    props: { previewArticles },
  };
}
