import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({ pathname: "/projects", query: router.query });
  }, []);

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export default IndexPage;
