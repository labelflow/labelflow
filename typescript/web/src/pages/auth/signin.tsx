import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useQueryParam, StringParam } from "use-query-params";
import { Meta } from "../../components/meta";
import { AppLifecycleManager } from "../../components/app-lifecycle-manager";
import { Layout } from "../../components/layout";
import { SigninModal } from "../../components/signin";

const LocalDatasetsIndexPage = () => {
  const router = useRouter();
  const [error] = useQueryParam("error", StringParam);
  const exitSignin = useCallback(() => {
    router.replace({ pathname: `/local/datasets`, query: router.query });
  }, []);
  return (
    <>
      <AppLifecycleManager />
      <Meta title="LabelFlow | Sign in" />
      <Layout>
        <SigninModal isOpen onClose={exitSignin} error={error} />
      </Layout>
    </>
  );
};

export default LocalDatasetsIndexPage;
