import { NextSeo } from "next-seo";
import { OpenGraph } from "next-seo/lib/types";
import Head from "next/head";
import * as React from "react";
import { APP_DESCRIPTION, APP_OFFICIAL_URL, APP_TITLE } from "../constants";

type Props = {
  title?: string;
  desc?: string;
  canonical?: string;
  images?: OpenGraph["images"];
  article?: OpenGraph["article"];
};

const defaultImages = [
  {
    url: "https://labelflow.ai/static/img/seo-img.png",
    width: 1200,
    height: 630,
    alt: "LabelFlow",
  },
  {
    url: "https://labelflow.ai/static/img/seo-img@5.png",
    width: 600,
    height: 315,
    alt: "LabelFlow",
  },
];

export const Meta = ({
  title = APP_TITLE,
  desc = APP_DESCRIPTION,
  canonical = APP_OFFICIAL_URL,
  images = defaultImages,
  article,
}: Props) => (
  <>
    <NextSeo
      title={title}
      description={desc}
      canonical={canonical}
      openGraph={{
        type: article ? "article" : "website",
        url: canonical,
        title,
        description: desc,
        locale: "en_US",
        images,
        article,
      }}
      twitter={{
        handle: "@LabelflowAI",
        site: "@LabelflowAI",
        cardType: "summary_large_image",
      }}
      facebook={{ appId: "461943602167313" }}
    />
    <Head>
      <link rel="icon" href="/static/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/favicon-16x16.png"
      />
      <link rel="manifest" href="/static/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#03C3BF" />
      <meta name="theme-color" content="#03C3BF" />
    </Head>
  </>
);
