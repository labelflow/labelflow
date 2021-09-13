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
import { Meta } from "../../../../components/meta";
import { ServiceWorkerManagerModal } from "../../../../components/service-worker-manager";
import { Layout } from "../../../../components/layout";
import { Error404Content } from "../../../404";
import { ExportButton } from "../../../../components/export-button";
import { ImportButton } from "../../../../components/import-button";
import { KeymapButton } from "../../../../components/layout/top-bar/keymap-button";
import { AuthManager } from "../../../../components/auth-manager";
import { WelcomeManager } from "../../../../components/welcome-manager";
import { CookieBanner } from "../../../../components/cookie-banner";

const getDataset = gql`
  query getDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
      id
      name
    }
  }
`;

const ArrowRightIcon = chakra(RiArrowRightSLine);

const DatasetIndexPage = () => {
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
        pathname: `/local/datasets/${datasetSlug}/images`,
      });
    }
  }, [error, loading]);

  const handleError = useErrorHandler();
  if (error && !loading) {
    if (!error.message.match(/No dataset with slug/)) {
      handleError(error);
    }
    return (
      <>
        <ServiceWorkerManagerModal />
        <WelcomeManager />
        <AuthManager />
        <Meta title="LabelFlow | Dataset not found" />
        <CookieBanner />
        <Error404Content />
      </>
    );
  }

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title={`LabelFlow | ${datasetName ?? "Dataset"}`} />
      <CookieBanner />
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

            <BreadcrumbItem isCurrentPage>
              {<Text>{datasetName}</Text> ?? <Skeleton>Dataset Name</Skeleton>}
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
