import { gql, useQuery } from "@apollo/client";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { isNil } from "lodash/fp";
import { createContext, PropsWithChildren, useContext } from "react";
import { usePagination } from "../pagination";

export const getPaginatedDatasetsQuery = gql`
  query getPaginatedDatasets(
    $where: DatasetWhereInput
    $first: Int!
    $skip: Int!
  ) {
    datasets(where: $where, first: $first, skip: $skip) {
      id
      name
      slug
      images(first: 1) {
        id
        url
        thumbnail500Url
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

type UseQueryParamSetter = (
  value: string,
  updateType?: "replace" | "push" | "replaceIn" | "pushIn" | undefined
) => void;

export type DatasetListProps = {
  workspaceSlug: string | string[];
  setEditDatasetId: UseQueryParamSetter;
  setDeleteDatasetId: UseQueryParamSetter;
};
export type DatasetListProviderProps = PropsWithChildren<DatasetListProps>;

export type DatasetListState = {
  loading: boolean;
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
  workspaceSlug: string | string[];
  setEditDatasetId: UseQueryParamSetter;
  setDeleteDatasetId: UseQueryParamSetter;
};

export const DatasetListContext = createContext({} as DatasetListState);

export const DatasetListProvider = ({
  workspaceSlug,
  children,
  setEditDatasetId,
  setDeleteDatasetId,
}: DatasetListProviderProps) => {
  const { page, perPage, itemCount } = usePagination();
  const { data: datasetsResult, loading: datasetQueryLoading } = useQuery<{
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
  }>(getPaginatedDatasetsQuery, {
    variables: {
      where: { workspaceSlug },
      first: perPage,
      skip: (page - 1) * perPage,
    },
    skip: workspaceSlug == null,
  });
  const state = {
    datasets: datasetsResult?.datasets ?? [],
    loading: isNil(itemCount) || datasetQueryLoading,
    workspaceSlug,
    setEditDatasetId,
    setDeleteDatasetId,
  };
  return (
    <DatasetListContext.Provider value={state}>
      {children}
    </DatasetListContext.Provider>
  );
};

export const useDatasetList = () => {
  return useContext(DatasetListContext);
};
