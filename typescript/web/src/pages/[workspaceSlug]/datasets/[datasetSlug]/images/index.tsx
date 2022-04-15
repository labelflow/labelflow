import { useQuery } from "@apollo/client";
import { BreadcrumbLink, Skeleton, Text } from "@chakra-ui/react";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { isEmpty } from "lodash/fp";
import NextLink from "next/link";
import { useErrorHandler } from "react-error-boundary";
import { Authenticated } from "../../../../../components/auth";
import { CookieBanner } from "../../../../../components/cookie-banner";
import { ImagesList } from "../../../../../components/dataset-images-list";
import { ExportButton } from "../../../../../components/export-button";
import { ImportButton } from "../../../../../components/import-button";
import { Layout } from "../../../../../components/layout";
import { DatasetTabBar } from "../../../../../components/layout/tab-bar/dataset-tab-bar";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { NavLogo } from "../../../../../components/logo/nav-logo";
import { Meta } from "../../../../../components/meta";
import { WorkspaceSwitcher } from "../../../../../components/workspace-switcher";
import { useDataset, useWorkspace } from "../../../../../hooks";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../../../../shared-queries/dataset-images-page.query";
import { Error404Content } from "../../../../404";

const Body = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();

  const {
    data: datasetResult,
    error: datasetQueryError,
    loading: datasetQueryLoading,
  } = useQuery<{
    dataset: DatasetType;
  }>(DATASET_IMAGES_PAGE_DATASET_QUERY, {
    variables: {
      slug: datasetSlug,
      workspaceSlug,
    },
    skip: isEmpty(datasetSlug) || isEmpty(workspaceSlug),
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
        <Meta title="LabelFlow | Dataset not found" />
        <CookieBanner />
        <Error404Content />
      </>
    );
  }
  return (
    <>
      <Meta title="LabelFlow | Images" />
      <CookieBanner />
      <Layout
        fullHeight
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
            <ImportButton datasetId={datasetResult?.dataset?.id} />
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
        {datasetResult && (
          <ImagesList
            datasetSlug={datasetSlug}
            workspaceSlug={workspaceSlug}
            datasetId={datasetResult.dataset.id}
            imagesTotalCount={imagesTotalCount ?? 0}
          />
        )}
      </Layout>
    </>
  );
};

const ImagesPage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default ImagesPage;
