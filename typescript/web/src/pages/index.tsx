import { isEmpty } from "lodash/fp";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { Authenticated } from "../components/auth";
import { CookieBanner } from "../components/cookie-banner";
import { Home } from "../components/home";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { WelcomeModal } from "../components/welcome-manager";
import { APP_TITLE } from "../constants";
import Website from "./website";

const App = () => (
  <Authenticated>
    <WelcomeModal />
    <Meta title={APP_TITLE} />
    <CookieBanner />
    <Layout breadcrumbs={[<NavLogo key={0} />]}>
      <Home />
    </Layout>
  </Authenticated>
);

const IndexPage = () => {
  const { status } = useSession();
  return (
    <>
      {status === "authenticated" && <App />}
      {status === "unauthenticated" && <Website previewArticles={[]} />}
    </>
  );
};

const getQueryParams = (query: ParsedUrlQuery): string => {
  return Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`
    )
    .join("&");
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {},
  redirect: isEmpty(query)
    ? undefined
    : {
        destination: `/website?${getQueryParams(query)}`,
        permanent: false,
      },
});

export default IndexPage;
