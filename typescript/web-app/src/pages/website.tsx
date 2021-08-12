import { Box, useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";

import { NavContent } from "../components/website/Navbar/NavContent";
import { Hero } from "../components/website/Hero/Hero";
import { Features } from "../components/website/Features/Features";
import { LogoGrid } from "../components/website/Logos/LogoGrid";

import { Why } from "../components/website/Why/Why";
import { Footer } from "../components/website/Footer/Footer";
import { Pricing } from "../components/website/Pricing/Pricing";
import { Meta } from "../components/website/Meta";
import { BlogPreview } from "../components/website/Blog/BlogPreview";
import { getPreviewArticlesForHome, Article } from "../connectors/strapi";

export default function Website({
  previewArticles,
}: {
  previewArticles: Omit<Article, "content">[];
}) {
  return (
    <Box minH="640px">
      <Meta />

      <Box
        as="header"
        bg={mode("white", "gray.800")}
        position="relative"
        zIndex="10"
      >
        <Box
          as="nav"
          aria-label="Main navigation"
          maxW="7xl"
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <NavContent.Mobile display={{ base: "flex", lg: "none" }} />
          <NavContent.Desktop display={{ base: "none", lg: "flex" }} />
        </Box>
      </Box>
      <Hero />
      <Features />
      <Why />
      {/* <Testimonials /> */}
      <LogoGrid />
      <Pricing />
      <BlogPreview previewArticles={previewArticles} />
      <Footer />
    </Box>
  );
}

export async function getStaticProps(): Promise<{
  props: { previewArticles: Omit<Article, "content">[] };
}> {
  const previewArticles = (await getPreviewArticlesForHome()) || [];
  return {
    props: { previewArticles },
  };
}
