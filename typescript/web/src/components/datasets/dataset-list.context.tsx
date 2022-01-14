import { useQuery } from "@apollo/client";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { isEmpty, isNil } from "lodash/fp";
import { createContext, PropsWithChildren, useContext } from "react";
import { UrlUpdateType } from "use-query-params";
import { usePagination } from "../pagination";
import { getPaginatedDatasetsQuery } from "./datasets.query";

type UseQueryParamSetter = (
  value: string,
  updateType?: UrlUpdateType | undefined
) => void;

export type DatasetListProps = {
  workspaceSlug?: string | string[];
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
  workspaceSlug?: string | string[];
  setEditDatasetId: UseQueryParamSetter;
  setDeleteDatasetId: UseQueryParamSetter;
};

export const DatasetListContext = createContext({} as DatasetListState);

const useProviderState = (
  props: DatasetListProviderProps
): DatasetListState => {
  const { workspaceSlug, setDeleteDatasetId, setEditDatasetId } = props;
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
    skip: isEmpty(workspaceSlug) || itemCount === 0,
  });
  const state = {
    datasets: datasetsResult?.datasets ?? [],
    loading: isNil(itemCount) || datasetQueryLoading,
    workspaceSlug,
    setEditDatasetId,
    setDeleteDatasetId,
  };

  return state;
};

export const DatasetListProvider = ({
  children,
  ...props
}: DatasetListProviderProps) => {
  return (
    <DatasetListContext.Provider value={useProviderState(props)}>
      {children}
    </DatasetListContext.Provider>
  );
};

export const useDatasetList = () => useContext(DatasetListContext);
