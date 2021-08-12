import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { AppLifecycleManager } from "../../../components/app-lifecycle-manager";
import { Layout } from "../../../components/layout";

const getProject = gql`
  query getProject($id: ID!) {
    project(where: { id: $id }) {
      id
    }
  }
`;

const ProjectIndexPage = ({
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();
  const { projectId } = router?.query;

  const { error } = useQuery(getProject, {
    variables: { id: projectId },
    skip: typeof projectId !== "string",
  });

  useEffect(() => {
    if (!error) {
      router.replace({
        pathname: `/projects/${projectId}/images`,
      });
    } else {
      router.replace({
        pathname: "/404",
      });
    }
  }, [error]);

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

export default ProjectIndexPage;
