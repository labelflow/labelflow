import React, { useCallback, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  Text,
  Box,
  Center,
  Button,
  Heading,
} from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useQueryParam } from "use-query-params";
import { useCookie } from "next-cookie";
import { useErrorHandler } from "react-error-boundary";

import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { IdParam, BoolParam } from "../../../utils/query-param-bool";
import { NewDatasetCard, DatasetCard } from "../../../components/datasets";

import { UpsertDatasetModal } from "../../../components/datasets/upsert-dataset-modal";
import { DeleteDatasetModal } from "../../../components/datasets/delete-dataset-modal";
import { AppLifecycleManager } from "../../../components/app-lifecycle-manager";

import { EmptyStateCaughtUp } from "../../../components/empty-state";

// TODO: update the resolvers once the workspaces have been implemented
export const getDatasetsQuery = gql`
  query getDatasets {
    datasets {
      id
      name
      images(first: 1) {
        id
        url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;

const createDemoDatasetQuery = gql`
  mutation createDemoDataset {
    createDemoDataset {
      id
      name
      images(first: 1) {
        id
        url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;

const DatasetPage = ({
  cookie,
  assumeServiceWorkerActive,
}: {
  cookie: string;
  assumeServiceWorkerActive: boolean;
}) => {
  const router = useRouter();

  const { data: datasetsResult, loading } =
    useQuery<{
      datasets: Pick<
        DatasetType,
        | "id"
        | "name"
        | "images"
        | "imagesAggregates"
        | "labelClassesAggregates"
        | "labelsAggregates"
      >[];
    }>(getDatasetsQuery);

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

  const parsedCookie = useCookie(cookie);

  const didVisitDemoDataset = parsedCookie.get("didVisitDemoDataset");
  const hasUserTriedApp = parsedCookie.get("hasUserTriedApp");
  const hasDatasets =
    datasetsResult?.datasets == null
      ? false
      : datasetsResult?.datasets?.length > 0;

  const [createDemoDatasetMutation] = useMutation(createDemoDatasetQuery, {
    update: (cache, { data: { createDemoDataset } }) => {
      cache.writeQuery({
        query: getDatasetsQuery,
        data: {
          datasets: [...(datasetsResult?.datasets ?? []), createDemoDataset],
        },
      });
    },
  });

  const demoDataset =
    datasetsResult?.datasets == null
      ? undefined
      : datasetsResult?.datasets.filter(
          (dataset) => dataset.name === "Demo dataset"
        )?.[0] ?? undefined;

  const handleError = useErrorHandler();

  useEffect(() => {
    const createDemoDataset = async () => {
      if (loading === true || hasDatasets) return;
      if (!didVisitDemoDataset && demoDataset == null) {
        try {
          await createDemoDatasetMutation();
        } catch (error) {
          parsedCookie.set("didVisitDemoDataset", true);
          handleError(error);
        }
      }
    };
    createDemoDataset();
  }, [
    demoDataset,
    loading,
    didVisitDemoDataset,
    parsedCookie,
    router,
    hasDatasets,
  ]);

  useEffect(() => {
    if (!hasUserTriedApp) {
      parsedCookie.set("hasUserTriedApp", true);
    }

    if (
      !didVisitDemoDataset &&
      datasetsResult?.datasets != null &&
      loading === false
    ) {
      // This is the first visit of the user and the datasets query returned, redirect to demo dataset
      const demoDatasetId = demoDataset?.id ?? "";
      const firstImageId = demoDataset?.images?.[0]?.id;
      if (firstImageId != null) {
        const route = `/local/datasets/${demoDatasetId}/images/${firstImageId}`;
        parsedCookie.set("didVisitDemoDataset", true);
        router.replace({ pathname: route, query: router.query });
      }
    }
  }, [
    router,
    router.query,
    datasetsResult,
    parsedCookie,
    loading,
    didVisitDemoDataset,
    hasUserTriedApp,
    demoDataset,
  ]);

  const shouldDisplayEmptyState =
    !didVisitDemoDataset && demoDataset == null && loading === false;

  return (
    <>
      <AppLifecycleManager
        assumeServiceWorkerActive={assumeServiceWorkerActive}
      />
      <Meta title="Labelflow | Datasets" />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            spacing="8px"
            separator={<RiArrowRightSLine color="gray.500" />}
          >
            <BreadcrumbItem>
              <Text>Datasets</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
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

        {shouldDisplayEmptyState ? (
          <Center h="full">
            <Box as="section">
              <Box
                maxW="2xl"
                mx="auto"
                px={{ base: "6", lg: "8" }}
                py={{ base: "16", sm: "20" }}
                textAlign="center"
              >
                <EmptyStateCaughtUp w="full" />
                <Heading as="h2">Creating a demo dataset</Heading>
                <Text mt="4" fontSize="lg">
                  It should only take a few seconds, but if you don&apos;t want
                  to wait, you can create an empty dataset.
                </Text>

                <Button
                  colorScheme="brand"
                  variant="outline"
                  mt="8"
                  onClick={() => {
                    setIsCreatingDataset(true, "replaceIn");
                  }}
                >
                  Create an Empty Dataset
                </Button>
              </Box>
            </Box>
          </Center>
        ) : (
          <Flex direction="row" wrap="wrap" p={4}>
            <NewDatasetCard
              addDataset={() => {
                setIsCreatingDataset(true, "replaceIn");
              }}
            />

            {datasetsResult?.datasets?.map(
              ({
                id,
                images,
                name,
                imagesAggregates,
                labelsAggregates,
                labelClassesAggregates,
              }) => (
                <DatasetCard
                  key={id}
                  url={`/local/datasets/${id}`}
                  imageUrl={images[0]?.url}
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
            )}
          </Flex>
        )}
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      cookie: context.req.headers.cookie || "",
    },
  };
};

export default DatasetPage;
