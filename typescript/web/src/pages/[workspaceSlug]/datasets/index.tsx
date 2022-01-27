import React, { useCallback } from "react";
import { useQuery } from "@apollo/client";

import { Flex, Text } from "@chakra-ui/react";

import { useQueryParam } from "use-query-params";

import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { Spinner } from "../../../components/spinner";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { IdParam, BoolParam } from "../../../utils/query-param-bool";
import {
  NewDatasetCard,
  DatasetCard,
  DatasetCardBox,
} from "../../../components/datasets";
import { UpsertDatasetModal } from "../../../components/datasets/upsert-dataset-modal";
import { DeleteDatasetModal } from "../../../components/datasets/delete-dataset-modal";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeModal } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { NavLogo } from "../../../components/logo/nav-logo";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../../shared-queries/workspace-datasets-page.query";

const LoadingCard = () => (
  <DatasetCardBox>
    <Flex
      w="100%"
      h="2xs"
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Spinner color="brand.500" size="xl" />
    </Flex>
  </DatasetCardBox>
);
const DatasetPage = () => {
  const {
    query: { workspaceSlug },
    isReady,
  } = useRouter();

  const { data: datasetsResult, loading } = useQuery<{
    datasets: Pick<
      DatasetType,
      | "id"
      | "name"
      | "slug"
      | "images"
      | "imagesAggregates"
      | "labelClassesAggregates"
      | "labelsAggregates"
    >[];
  }>(WORKSPACE_DATASETS_PAGE_DATASETS_QUERY, {
    variables: { where: { workspaceSlug } },
    skip: workspaceSlug == null,
  });

  const [isCreatingDataset, setIsCreatingDataset] = useQueryParam(
    "modal-create-dataset",
    BoolParam
  );
  const [editDatasetId, setEditDatasetId] = useQueryParam(
    "modal-edit-dataset",
    IdParam
  );
  const [deleteDatasetId, setDeleteDatasetId] = useQueryParam(
    "alert-delete-dataset",
    IdParam
  );

  const onClose = useCallback(() => {
    if (editDatasetId) {
      setEditDatasetId(null, "replaceIn");
    }

    if (isCreatingDataset) {
      setIsCreatingDataset(false, "replaceIn");
    }

    if (deleteDatasetId) {
      setDeleteDatasetId(null, "replaceIn");
    }
  }, [editDatasetId, isCreatingDataset, deleteDatasetId]);

  return (
    <>
      <WelcomeModal />
      <AuthManager />
      <Meta title="LabelFlow | Datasets" />
      <CookieBanner />
      <Layout
        tabBar={
          <WorkspaceTabBar
            currentTab="datasets"
            workspaceSlug={workspaceSlug as string}
          />
        }
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Datasets</Text>,
        ]}
      >
        <UpsertDatasetModal
          isOpen={isCreatingDataset || editDatasetId != null}
          onClose={onClose}
          datasetId={editDatasetId}
        />

        <DeleteDatasetModal
          isOpen={deleteDatasetId != null}
          onClose={onClose}
          datasetId={deleteDatasetId}
        />

        <Flex direction="row" wrap="wrap" p={4}>
          <NewDatasetCard
            disabled={!isReady}
            addDataset={() => {
              setIsCreatingDataset(true, "replaceIn");
            }}
          />
          {loading ? (
            <LoadingCard />
          ) : (
            datasetsResult?.datasets?.map(
              ({
                id,
                slug,
                images,
                name,
                imagesAggregates,
                labelsAggregates,
                labelClassesAggregates,
              }) => (
                <DatasetCard
                  key={id}
                  url={`/${workspaceSlug}/datasets/${slug}`}
                  imageUrl={images[0]?.thumbnail500Url ?? undefined}
                  datasetName={name}
                  imagesCount={imagesAggregates.totalCount}
                  labelClassesCount={labelClassesAggregates.totalCount}
                  labelsCount={labelsAggregates.totalCount}
                  editDataset={() => {
                    setEditDatasetId(id, "replaceIn");
                  }}
                  deleteDataset={() => {
                    setDeleteDatasetId(id, "replaceIn");
                  }}
                />
              )
            )
          )}
        </Flex>
      </Layout>
    </>
  );
};

export default DatasetPage;
