import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Authenticated } from "../../components/auth";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";
import { LayoutSpinner } from "../../components";
import { WorkspaceSwitcher } from "../../components/workspace-switcher";

const LocalDatasetsIndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const {
        query: { workspaceSlug, ...queryRest },
      } = router;
      router.replace({
        pathname: `/${workspaceSlug}/datasets`,
        query: queryRest,
      });
    }
  }, [router, router.isReady]);

  return (
    <Authenticated withWorkspaces>
      <Meta title="LabelFlow" />
      <CookieBanner />
      <Layout
        breadcrumbs={[<NavLogo key={0} />, <WorkspaceSwitcher key={1} />]}
      >
        <LayoutSpinner />
      </Layout>
    </Authenticated>
  );
};

export default LocalDatasetsIndexPage;
