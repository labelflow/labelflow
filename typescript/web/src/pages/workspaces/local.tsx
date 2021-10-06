import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ServiceWorkerManagerModal } from "../../components/service-worker-manager";
import { AuthManager } from "../../components/auth-manager";
import { Layout } from "../../components/layout";
import { WelcomeManager } from "../../components/welcome-manager";
import { CookieBanner } from "../../components/cookie-banner";
import { Meta } from "../../components/meta";
import { NavLogo } from "../../components/logo/nav-logo";

const LocalWorkspacesRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({ pathname: `/local/datasets`, query: router.query });
  }, []);

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Local Workspace" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export default LocalWorkspacesRedirectPage;
