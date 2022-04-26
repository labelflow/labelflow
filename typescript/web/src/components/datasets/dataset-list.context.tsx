import { useQuery } from "@apollo/client";
import { isEmpty, isNil } from "lodash/fp";
import { createContext, PropsWithChildren, useContext } from "react";
import { UrlUpdateType } from "use-query-params";
import {
  WorkspaceDatasetsPageDatasetsQuery,
  WorkspaceDatasetsPageDatasetsQueryVariables,
  WorkspaceDatasetsPageDatasetsQuery_datasets,
} from "../../graphql-types/WorkspaceDatasetsPageDatasetsQuery";
import { useWorkspace } from "../../hooks";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../shared-queries/workspace-datasets-page.query";
import { usePagination } from "../core";

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
  datasets: WorkspaceDatasetsPageDatasetsQuery_datasets[];
  workspaceSlug?: string | string[];
  setEditDatasetId: UseQueryParamSetter;
  setDeleteDatasetId: UseQueryParamSetter;
};

export const DatasetListContext = createContext({} as DatasetListState);

const useProviderState = (
  props: DatasetListProviderProps
): DatasetListState => {
  const { setDeleteDatasetId, setEditDatasetId } = props;
  const { slug: workspaceSlug } = useWorkspace();
  const { page, perPage, itemCount } = usePagination();
  const { data: datasetsResult, loading: datasetQueryLoading } = useQuery<
    WorkspaceDatasetsPageDatasetsQuery,
    WorkspaceDatasetsPageDatasetsQueryVariables
  >(WORKSPACE_DATASETS_PAGE_DATASETS_QUERY, {
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
