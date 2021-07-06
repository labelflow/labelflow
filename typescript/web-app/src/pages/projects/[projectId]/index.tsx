import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Layout } from "../../../components/layout";

const ProjectIndexPage = () => {
  const router = useRouter();
  const projectId = router?.query?.projectId;

  useEffect(() => {
    router.replace({
      pathname: `/projects/${projectId}/images`,
    });
  }, []);

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export default ProjectIndexPage;
