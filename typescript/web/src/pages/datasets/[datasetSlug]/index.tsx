import React, { useEffect } from "react";
import {
  chakra,
  Spinner,
  Skeleton,
  Text,
  Center,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { useErrorHandler } from "react-error-boundary";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";
import { AppLifecycleManager } from "../../../components/app-lifecycle-manager";
import { Layout } from "../../../components/layout";
import Error404Page from "../../404";
import { ExportButton } from "../../../components/export-button";
import { ImportButton } from "../../../components/import-button";
import { KeymapButton } from "../../../components/layout/top-bar/keymap-button";

const getDataset = gql`
  query getDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
      id
      name
    }
  }
`;

const ArrowRightIcon = chakra(RiArrowRightSLine);

const DatasetIndexPage = ({
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();
  const { datasetSlug } = router?.query;

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery(getDataset, {
    variables: { slug: datasetSlug },
    skip: typeof datasetSlug !== "string",
  });

  const datasetName = datasetResult?.dataset.name;

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
              <NextLink href="/datasets">
                <BreadcrumbLink>Datasets</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>{datasetName ?? <Skeleton>Dataset Name</Skeleton>}</Text>
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
      >
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export default DatasetIndexPage;
