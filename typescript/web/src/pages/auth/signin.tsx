import { useRouter } from "next/router";
import React, { useCallback } from "react";
import {
  SignInModal,
  SignInModalProvider,
} from "../../components/auth-manager/signin-modal";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";
import { ServiceWorkerManagerBackground } from "../../components/service-worker-manager";

const LocalDatasetsIndexPage = () => {
  const router = useRouter();
  const exitSignIn = useCallback(async () => {
    await router.replace({ pathname: `/local/datasets`, query: router.query });
  }, [router]);
  return (
    <>
      <ServiceWorkerManagerBackground />
      <Meta title="LabelFlow | Sign in" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <SignInModalProvider onClose={exitSignIn}>
          <SignInModal />
        </SignInModalProvider>
      </Layout>
    </>
  );
};

export default LocalDatasetsIndexPage;
