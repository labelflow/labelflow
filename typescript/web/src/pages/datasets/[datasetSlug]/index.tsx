import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { useErrorHandler } from "react-error-boundary";
import { AppLifecycleManager } from "../../../components/app-lifecycle-manager";
import { Layout } from "../../../components/layout";
import Error404Page from "../../404";

const getDataset = gql`
  query getDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
      id
    }
  }
`;

const DatasetIndexPage = ({
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();
  const { datasetSlug } = router?.query;

  const { error, loading } = useQuery(getDataset, {
    variables: { slug: datasetSlug },
    skip: typeof datasetSlug !== "string",
  });

  useEffect(() => {
    if (!error && !loading) {
      router.replace({
        pathname: `/datasets/${datasetSlug}/images`,
      });
    }
  }, [error, loading]);

  const handleError = useErrorHandler();
  if (error) {
    if (!error.message.match(/No dataset with id/)) {
      handleError(error);
    }
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

export default DatasetIndexPage;
