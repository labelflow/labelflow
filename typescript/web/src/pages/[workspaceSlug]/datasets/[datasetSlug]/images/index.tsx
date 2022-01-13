import { gql, useQuery } from "@apollo/client";
import NextLink from "next/link";
import { Skeleton, Text, BreadcrumbLink } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useErrorHandler } from "react-error-boundary";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";

import { WorkspaceSwitcher } from "../../../../../components/workspace-switcher";
import { NavLogo } from "../../../../../components/logo/nav-logo";
import { ServiceWorkerManagerModal } from "../../../../../components/service-worker-manager";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { ImportButton } from "../../../../../components/import-button";
import { ExportButton } from "../../../../../components/export-button";
import { Meta } from "../../../../../components/meta";
import { Layout } from "../../../../../components/layout";
import { DatasetTabBar } from "../../../../../components/layout/tab-bar/dataset-tab-bar";
import { Error404Content } from "../../../../404";
import { AuthManager } from "../../../../../components/auth-manager";

import { WelcomeManager } from "../../../../../components/welcome-manager";
import { CookieBanner } from "../../../../../components/cookie-banner";
import { ImagesList } from "../../../../../components/dataset-images-list";

export const datasetDataQuery = gql`
  query getDatasetData($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
      imagesAggregates {
        totalCount
      }
    }
  }
`;

const ImagesPage = () => {
  const router = useRouter();
  const datasetSlug = router?.query?.datasetSlug as string;
  const workspaceSlug = router?.query?.workspaceSlug as string;

  const {
    data: datasetResult,
    error: datasetQueryError,
    loading: datasetQueryLoading,
  } = useQuery<{
    dataset: DatasetType;
  }>(datasetDataQuery, {
    variables: {
      slug: datasetSlug,
      workspaceSlug,
    },
    skip: !datasetSlug || !workspaceSlug,
  });

  const imagesTotalCount: number | undefined =
    datasetResult?.dataset?.imagesAggregates?.totalCount;
  const datasetName = datasetResult?.dataset.name;

  const handleError = useErrorHandler();
  if (datasetQueryError && !datasetQueryLoading) {
    if (
      !datasetQueryError.message.match(/Couldn't find dataset corresponding to/)
    ) {
      handleError(datasetQueryError);
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
      <Meta title="LabelFlow | Images" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <NextLink key={2} href={`/${workspaceSlug}/datasets`}>
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>,
          <NextLink key={3} href={`/${workspaceSlug}/datasets/${datasetSlug}`}>
            <BreadcrumbLink>
              {datasetName ?? <Skeleton>Dataset Name</Skeleton>}
            </BreadcrumbLink>
          </NextLink>,
          <Text key={4}>Images</Text>,
        ]}
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
        tabBar={
          <DatasetTabBar
            currentTab="images"
            datasetSlug={datasetSlug}
            workspaceSlug={workspaceSlug}
          />
        }
      >
        <ImagesList
          datasetSlug={datasetSlug}
          workspaceSlug={workspaceSlug}
          datasetId={datasetResult?.dataset.id}
          imagesTotalCount={imagesTotalCount ?? 0}
        />
      </Layout>
    </>
  );
};

export default ImagesPage;
