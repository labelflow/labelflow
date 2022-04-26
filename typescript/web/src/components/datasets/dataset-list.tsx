import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { PaginationProvider, PaginationFooter, Spinner } from "../core";
import { DatasetCard } from "./dataset-card";
import { DatasetCardBox } from "./dataset-card-box";
import {
  DatasetListProps,
  DatasetListProvider,
  useDatasetList,
} from "./dataset-list.context";
import { GET_DATASETS_IDS_QUERY } from "./get-datasets-ids.query";

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

const Content = () => {
  const {
    loading,
    datasets,
    workspaceSlug,
    setDeleteDatasetId,
    setEditDatasetId,
  } = useDatasetList();
  return loading ? (
    <LoadingCard />
  ) : (
    <>
      {datasets.map(
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
            editDataset={() => setEditDatasetId(id, "replaceIn")}
            deleteDataset={() => setDeleteDatasetId(id, "replaceIn")}
          />
        )
      )}
    </>
  );
};

export const DatasetList = (props: DatasetListProps) => {
  const { workspaceSlug } = props;
  const { data: datasetsResult, loading: totalCountLoading } = useQuery<{
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
  }>(GET_DATASETS_IDS_QUERY, {
    variables: { where: { workspaceSlug } },
    skip: workspaceSlug == null,
  });
  return (
    <PaginationProvider
      itemCount={datasetsResult?.datasets.length ?? 0}
      perPageOptions={[25, 50, 100]}
    >
      {totalCountLoading ? (
        <LoadingCard />
      ) : (
        <DatasetListProvider {...props}>
          <Content />
          <PaginationFooter />
        </DatasetListProvider>
      )}
    </PaginationProvider>
  );
};
