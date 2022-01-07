import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { AuthManager } from "../../components/auth-manager";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";
import { LayoutSpinner } from "../../components/spinner";
import { WelcomeModal } from "../../components/welcome-manager";

const LocalWorkspacesRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({
      pathname: router.pathname.replace(/^\/workspaces/g, ""),
      query: router.query,
    });
  }, []);

  return (
    <>
      <WelcomeModal />
      <AuthManager />
      <Meta title="LabelFlow | Workspace" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <LayoutSpinner />
      </Layout>
    </>
  );
};

export default LocalWorkspacesRedirectPage;
