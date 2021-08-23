import React, { useCallback } from "react";
import { gql, useQuery } from "@apollo/client";

import { GetServerSideProps } from "next";
import { Flex, Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useQueryParam } from "use-query-params";

import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { IdParam, BoolParam } from "../../utils/query-param-bool";
import { NewDatasetCard, DatasetCard } from "../../components/datasets";

import { UpsertDatasetModal } from "../../components/datasets/upsert-dataset-modal";
import { DeleteDatasetModal } from "../../components/datasets/delete-dataset-modal";
import { AppLifecycleManager } from "../../components/app-lifecycle-manager";

export const getDatasetsQuery = gql`
  query getDatasets {
    datasets {
      id
      name
      slug
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
  assumeServiceWorkerActive,
}: {
  assumeServiceWorkerActive: boolean;
}) => {
  const { data: datasetsResult } =
    useQuery<{
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

        <Flex direction="row" wrap="wrap" p={4}>
          <NewDatasetCard
            addDataset={() => {
              setIsCreatingDataset(true, "replaceIn");
            }}
          />

          {datasetsResult?.datasets?.map(
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
                url={`/datasets/${slug}`}
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
