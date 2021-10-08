import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useQueryParam, StringParam } from "use-query-params";
import { Meta } from "../../components/meta";
import { ServiceWorkerManagerBackground } from "../../components/service-worker-manager";
import { Layout } from "../../components/layout";
import { SigninModal } from "../../components/auth-manager/signin-modal";
import { CookieBanner } from "../../components/cookie-banner";
import { NavLogo } from "../../components/logo/nav-logo";

const LocalDatasetsIndexPage = () => {
  const router = useRouter();
  const [error, setError] = useQueryParam("error", StringParam);
  const [linkSent, setLinkSent] = useQueryParam("link-sent", StringParam);
  const exitSignin = useCallback(() => {
    router.replace({ pathname: `/local/datasets`, query: router.query });
  }, []);
  return (
    <>
      <ServiceWorkerManagerBackground />
      <Meta title="LabelFlow | Sign in" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <SigninModal
          isOpen
          onClose={exitSignin}
          error={error}
          setError={setError}
          setIsOpen={() => {}}
          linkSent={linkSent}
          setLinkSent={setLinkSent}
        />
      </Layout>
    </>
  );
};

export default LocalDatasetsIndexPage;
