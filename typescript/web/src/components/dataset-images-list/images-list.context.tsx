import { useQuery } from "@apollo/client";
import { isEmpty } from "lodash/fp";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  PaginatedImagesQuery,
  PaginatedImagesQueryVariables,
  PaginatedImagesQuery_images,
} from "../../graphql-types/PaginatedImagesQuery";
import { usePagination } from "../pagination/pagination.context";
import { PAGINATED_IMAGES_QUERY } from "./paginated-images-query";

export type ImagesListProps = {
  workspaceSlug: string;
  datasetSlug: string;
  datasetId: string;
  imagesTotalCount: number;
};

export type ImagesListState = Pick<
  ImagesListProps,
  "workspaceSlug" | "datasetSlug" | "datasetId"
> & {
  loading: boolean;
  images: PaginatedImagesQuery_images[];
  imagesSelected: string[];
  setImagesSelected: Dispatch<SetStateAction<string[]>>;
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
  const [imagesSelected, setImagesSelected] = useState<string[]>([]);
  const { data: imagesResult, loading: imagesQueryLoading } = useQuery<
    PaginatedImagesQuery,
    PaginatedImagesQueryVariables
  >(PAGINATED_IMAGES_QUERY, {
    variables: {
      datasetId,
      first: perPage,
      skip: (page - 1) * perPage,
    },
    skip: !datasetId || itemCount === 0,
  });
  const state: ImagesListState = {
    workspaceSlug,
    datasetSlug,
    datasetId,
    loading: isEmpty(datasetId) || imagesQueryLoading,
    images: imagesResult?.images ?? [],
    imagesSelected,
    setImagesSelected,
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
