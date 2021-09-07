import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppLifecycleManager } from "../../components/app-lifecycle-manager";
import { AuthManager } from "../../components/auth-manager";
import { Layout } from "../../components/layout";

const WorkspacesRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({ pathname: `/local/datasets`, query: router.query });
  }, []);

  return (
    <>
      <AppLifecycleManager />
      <AuthManager />
      <Layout>
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export default WorkspacesRedirectPage;
