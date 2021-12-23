import { useQuery } from "@apollo/client";
import { Image, Query } from "@labelflow/graphql-types";
import { isEmpty, isNil } from "lodash/fp";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { usePagination } from "../pagination";
import { paginatedImagesQuery } from "./paginated-images-query";

export type ImagesListProps = {
  workspaceSlug: string;
  datasetSlug: string;
  datasetId: string | undefined;
  imagesTotalCount: number;
};

export type ImagesListState = Pick<
  ImagesListProps,
  "workspaceSlug" | "datasetSlug" | "datasetId"
> & {
  loading: boolean;
  images: Image[];
  toDelete?: string;
  setToDelete: (value: string | undefined) => void;
};

export const ImagesListContext = createContext({} as ImagesListState);

export type ImagesListProviderProps = PropsWithChildren<ImagesListProps>;

export const ImagesListProvider = ({
  datasetSlug,
  workspaceSlug,
  datasetId,
  children,
}: ImagesListProviderProps) => {
  const { page, perPage, itemCount } = usePagination();
  const [toDelete, setToDelete] = useState<string | undefined>(undefined);
  const { data: imagesResult, loading: imagesQueryLoading } = useQuery<
    Pick<Query, "images">
  >(paginatedImagesQuery, {
    variables: {
      datasetId,
      first: perPage,
      skip: (page - 1) * perPage,
    },
    skip: !datasetSlug || !workspaceSlug || !datasetId,
  });
  const state: ImagesListState = {
    workspaceSlug,
    datasetSlug,
    datasetId,
    loading: isEmpty(datasetId) || isNil(itemCount) || imagesQueryLoading,
    images: imagesResult?.images ?? [],
    toDelete,
    setToDelete,
  };
  return (
    <ImagesListContext.Provider value={state}>
      {children}
    </ImagesListContext.Provider>
  );
};

export const useImagesList = () => {
  return useContext(ImagesListContext);
};
