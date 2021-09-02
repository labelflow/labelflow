import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Meta } from "../../components/meta";
import { AppLifecycleManager } from "../../components/app-lifecycle-manager";
import { Layout } from "../../components/layout";

const LocalDatasetsIndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({ pathname: `/local/datasets`, query: router.query });
  }, []);

  return (
    <>
      <AppLifecycleManager />
      <Meta title="LabelFlow | Local Workspace" />
      <Layout>
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export default LocalDatasetsIndexPage;
