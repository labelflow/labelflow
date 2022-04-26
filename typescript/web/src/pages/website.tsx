import { Box } from "@chakra-ui/react";
import * as React from "react";
import { CookieBanner } from "../components/cookie-banner";
import { Meta } from "../components/meta";
import { Banner } from "../components/website/banner";
import { ArticlesList } from "../components/website/Blog/articles-list";
import { Features } from "../components/website/Features/Features";
import { Footer } from "../components/website/Footer/Footer";
import { Hero } from "../components/website/hero";
import { LogoGrid } from "../components/website/Logos/LogoGrid";
import { NavBar } from "../components/website/Navbar/NavBar";
import { Pricing } from "../components/website/pricing";
import { Proof } from "../components/website/proof";
import { IntroVideo } from "../components/website/intro-video";
import { Roadmap } from "../components/website/roadmap/roadmap";
import { Why } from "../components/website/Why/Why";
import { APP_TITLE } from "../constants";
import { getHomeStaticProps, HomeProps } from "../utils/get-home-static-props";

export default function Website({ previewArticles }: HomeProps) {
  return (
    <>
      <Meta title={APP_TITLE} />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <Hero />
        <Banner />
        <IntroVideo />
        <Features />
        <Proof />
        <Why />
        <LogoGrid />
        <Roadmap />
        <Pricing />
        <ArticlesList preview previewArticles={previewArticles} />
        <Footer />
      </Box>
    </>
  );
}

export const getStaticProps = getHomeStaticProps;
