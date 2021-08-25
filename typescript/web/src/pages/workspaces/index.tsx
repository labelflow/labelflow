import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppLifecycleManager } from "../../components/app-lifecycle-manager";
import { Layout } from "../../components/layout";

const WorkspacesRedirectPage = ({
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();

  useEffect(() => {
    router.replace({ pathname: `/local/datasets`, query: router.query });
  }, []);

  return (
    <>
      <AppLifecycleManager
        assumeServiceWorkerActive={assumeServiceWorkerActive}
      />
      <Layout>
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export default WorkspacesRedirectPage;
