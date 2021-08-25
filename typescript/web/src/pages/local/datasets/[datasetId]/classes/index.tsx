import { useQuery, gql } from "@apollo/client";
import NextLink from "next/link";
import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import { useErrorHandler } from "react-error-boundary";
import { AppLifecycleManager } from "../../../../../components/app-lifecycle-manager";
import { KeymapButton } from "../../../../../components/keymap-button";
import { ImportButton } from "../../../../../components/import-button";
import { ExportButton } from "../../../../../components/export-button";
import { Meta } from "../../../../../components/meta";
import { Layout } from "../../../../../components/layout";
import { DatasetTabBar } from "../../../../../components/layout/tab-bar/dataset-tab-bar";
import { ClassesList } from "../../../../../components/dataset-class-list";
import Error404Page from "../../../../404";

const ArrowRightIcon = chakra(RiArrowRightSLine);

const datasetNameQuery = gql`
  query getDatasetName($datasetId: ID!) {
    dataset(where: { id: $datasetId }) {
      id
      name
    }
  }
`;

const DatasetClassesPage = ({
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();
  const datasetId = router?.query?.datasetId as string;

  const { data: datasetResult, error } = useQuery<{
    dataset: { id: string; name: string };
  }>(datasetNameQuery, {
    variables: {
      datasetId,
    },
  });

  const datasetName = datasetResult?.dataset.name;

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
      <Meta title="Labelflow | Classes" />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            spacing="8px"
            sx={{ "*": { display: "inline !important" } }}
            separator={<ArrowRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <NextLink href="/local/datasets">
                <BreadcrumbLink>Datasets</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <NextLink href={`/local/datasets/${datasetId}`}>
                <BreadcrumbLink>{datasetName}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>Classes</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
        tabBar={<DatasetTabBar currentTab="classes" datasetId={datasetId} />}
      >
        <Center>
          <ClassesList datasetId={datasetId} />
        </Center>
      </Layout>
    </>
  );
};
export default DatasetClassesPage;
