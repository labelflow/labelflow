import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Meta } from "../../components/meta";
import { ServiceWorkerManagerModal } from "../../components/service-worker-manager";
import { AuthManager } from "../../components/auth-manager";
import { Layout } from "../../components/layout";
import { WelcomeManager } from "../../components/welcome-manager";
import { CookieBanner } from "../../components/cookie-banner";
import { NavLogo } from "../../components/logo/nav-logo";
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
  }, [router.isReady]);

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Local Workspace" />
      <CookieBanner />
      <Layout
        breadcrumbs={[<NavLogo key={0} />, <WorkspaceSwitcher key={1} />]}
      >
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export default LocalDatasetsIndexPage;
