import React from "react";
import { Authenticated } from "../../components/auth";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";
import { Workspaces } from "../../components/workspaces";
import { APP_NAME } from "../../constants";

const Page = () => (
  <Authenticated withWorkspaces>
    <Meta title={`${APP_NAME} | Workspaces`} />
    <CookieBanner />
    <Layout breadcrumbs={[<NavLogo key={0} />]}>
      <Workspaces />
    </Layout>
  </Authenticated>
);

export default Page;
