import React from "react";
import { useQuery, gql } from "@apollo/client";
import NextLink from "next/link";
import { Text, BreadcrumbLink, Skeleton, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useErrorHandler } from "react-error-boundary";

import { ServiceWorkerManagerModal } from "../../../../../components/service-worker-manager";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { ImportButton } from "../../../../../components/import-button";
import { ExportButton } from "../../../../../components/export-button";
import { Meta } from "../../../../../components/meta";
import { Layout } from "../../../../../components/layout";
import { DatasetTabBar } from "../../../../../components/layout/tab-bar/dataset-tab-bar";
import { ClassesList } from "../../../../../components/dataset-class-list";
import { Error404Content } from "../../../../404";
import { AuthManager } from "../../../../../components/auth-manager";
import { WelcomeManager } from "../../../../../components/welcome-manager";
import { CookieBanner } from "../../../../../components/cookie-banner";

const datasetNameQuery = gql`
  query getDatasetName($slug: String!) {
    dataset(where: { slugs: { datasetSlug: $slug, workspaceSlug: "local" } }) {
      id
      name
    }
  }
`;

const DatasetClassesPage = () => {
  const router = useRouter();
  const datasetSlug = router?.query?.datasetSlug as string;

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery<{
    dataset: { id: string; name: string };
  }>(datasetNameQuery, {
    variables: {
      slug: datasetSlug,
    },
  });

  const datasetName = datasetResult?.dataset.name;

  const handleError = useErrorHandler();
  if (error && !loading) {
    if (!error.message.match(/Couldn't find dataset corresponding to/)) {
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
      <Meta title="LabelFlow | Classes" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NextLink key={0} href="/local/datasets">
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>,
          <NextLink key={1} href={`/local/datasets/${datasetSlug}`}>
            <BreadcrumbLink>
              {datasetName ?? <Skeleton>Dataset Name</Skeleton>}
            </BreadcrumbLink>
          </NextLink>,
          <Text key={2}>Classes</Text>,
        ]}
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
        tabBar={
          <DatasetTabBar currentTab="classes" datasetSlug={datasetSlug} />
        }
      >
        <Center>
          <ClassesList datasetSlug={datasetSlug} />
        </Center>
      </Layout>
    </>
  );
};
export default DatasetClassesPage;
