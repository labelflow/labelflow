import React, { useCallback } from "react";
import { useQuery } from "@apollo/client";

import {
  AspectRatio,
  Box,
  Flex,
  Skeleton,
  Text,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";

import { useQueryParam } from "use-query-params";

import { useRouter } from "next/router";
import { isEmpty } from "lodash/fp";
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
import { Authenticated } from "../../../components/auth";
import { WelcomeModal } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { NavLogo } from "../../../components/logo/nav-logo";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../../shared-queries/workspace-datasets-page.query";
import {
  WorkspaceDatasetsPageDatasetsQuery,
  WorkspaceDatasetsPageDatasetsQueryVariables,
} from "../../../graphql-types/WorkspaceDatasetsPageDatasetsQuery";
import { useWorkspace } from "../../../hooks";
import { useTutorialLoadingStore } from "../../../utils/use-loading-store";
import { EmptyStateNoImages } from "../../../components/empty-state";

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

const TutorialLoadingCard = () => (
  <DatasetCardBox>
    <Box
      zIndex="1"
      as="a"
      w="100%"
      h="2xs"
      borderWidth="0px"
      borderRadius="16px"
      overflow="hidden"
      bg={mode("white", "gray.700")}
      display="block"
      cursor="pointer"
    >
      <AspectRatio maxH="32">
        <EmptyStateNoImages />
      </AspectRatio>
      <VStack pt="2" pl="5" pr="5" pb="5" align="center">
        <Text color={mode("gray.600", "gray.300")}>
          Your tutorial dataset is being loaded
        </Text>
        <Skeleton height="30px" width="90%" />
        <Skeleton height="30px" width="90%" />
      </VStack>
    </Box>
  </DatasetCardBox>
);

const Body = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const { isReady } = useRouter();
  const isTutorialLoading = useTutorialLoadingStore(
    (state) => state.tutorialDatasetLoading
  );

  const { data: datasetsResult, loading } = useQuery<
    WorkspaceDatasetsPageDatasetsQuery,
    WorkspaceDatasetsPageDatasetsQueryVariables
  >(WORKSPACE_DATASETS_PAGE_DATASETS_QUERY, {
    variables: { where: { workspaceSlug } },
    skip: isEmpty(workspaceSlug) || isTutorialLoading,
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
  }, [
    editDatasetId,
    isCreatingDataset,
    deleteDatasetId,
    setEditDatasetId,
    setIsCreatingDataset,
    setDeleteDatasetId,
  ]);

  return (
    <>
      <WelcomeModal />
      <Meta title="LabelFlow | Datasets" />
      <CookieBanner />
      <Layout
        tabBar={<WorkspaceTabBar currentTab="datasets" />}
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
          {isTutorialLoading && <TutorialLoadingCard />}
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

const DatasetPage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default DatasetPage;
