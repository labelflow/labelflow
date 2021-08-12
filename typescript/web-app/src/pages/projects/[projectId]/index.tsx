import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { AppLifecycleManager } from "../../../components/app-lifecycle-manager";
import { Layout } from "../../../components/layout";
import Error404Page from "../../404";

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

  const { error, loading } = useQuery(getProject, {
    variables: { id: projectId },
    skip: typeof projectId !== "string",
  });

  useEffect(() => {
    if (!error && !loading) {
      router.replace({
        pathname: `/projects/${projectId}/images`,
      });
    }
  }, [error, loading]);

  if (error) {
    return <Error404Page />;
  }

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
