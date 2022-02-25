import { useSession } from "next-auth/react";
import React from "react";
import { Authenticated } from "../components/auth";
import { CookieBanner } from "../components/cookie-banner";
import { Home } from "../components/home";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { APP_TITLE } from "../constants";
import { getHomeStaticProps, HomeProps } from "../utils/get-home-static-props";
import Website from "./website";

const App = () => (
  <Authenticated withWorkspaces>
    <Meta title={APP_TITLE} />
    <CookieBanner />
    <Layout breadcrumbs={[<NavLogo key={0} />]}>
      <Home />
    </Layout>
  </Authenticated>
);

const IndexPage = ({ previewArticles }: HomeProps) => {
  const { status } = useSession();
  return (
    <>
      {status === "authenticated" && <App />}
      {status === "unauthenticated" && (
        <Website previewArticles={previewArticles} />
      )}
    </>
  );
};

export const getStaticProps = getHomeStaticProps;

export default IndexPage;
