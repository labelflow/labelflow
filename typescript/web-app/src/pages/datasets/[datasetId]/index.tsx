import { useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { AppLifecycleManager } from "../../../components/app-lifecycle-manager";
import { Layout } from "../../../components/layout";

const getDataset = gql`
  query getDataset($id: ID!) {
    dataset(where: { id: $id }) {
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
  const { datasetId } = router?.query;

  const { error } = useQuery(getDataset, {
    variables: { id: datasetId },
    skip: typeof datasetId !== "string",
  });

  useEffect(() => {
    if (!error) {
      router.replace({
        pathname: `/datasets/${datasetId}/images`,
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

export default DatasetIndexPage;
