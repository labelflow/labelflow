import { gql, useMutation, useQuery } from "@apollo/client";
import { isEmpty, isNil } from "lodash/fp";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  DeleteImageMutation,
  DeleteImageMutationVariables,
  DeleteManyImagesMutation,
  DeleteManyImagesMutationVariables,
} from "../../graphql-types";
import {
  PaginatedImagesQuery,
  PaginatedImagesQueryVariables,
  PaginatedImagesQuery_images,
} from "../../graphql-types/PaginatedImagesQuery";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import { PaginationPayload, usePagination } from "../core";
import { useApolloErrorToast } from "../toast";
import {
  PAGINATED_IMAGES_QUERY,
  useFlushPaginatedImagesCache,
} from "./paginated-images-query";

const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImageMutation($id: ID!) {
    deleteImage(where: { id: $id }) {
      id
    }
  }
`;

const DELETE_MANY_IMAGES_MUTATION = gql`
  mutation DeleteManyImagesMutation($id: [ID!]!) {
    deleteManyImages(where: { id: { in: $id } })
  }
`;

export type ImagesListProps = {
  workspaceSlug: string;
  datasetSlug: string;
  datasetId: string;
  imagesTotalCount: number;
  selected?: string[];
  singleToDelete?: string;
  onChangeSelected?: (selected: string[]) => void;
  onChangeSingleToDelete?: (value: string | undefined) => void;
};

export type ImagesListData = {
  images: PaginatedImagesQuery_images[];
  selected: string[];
  singleToDelete?: string;
  deletingSingle: boolean;
  displayDeleteSelectedModal: boolean;
  deletingSelected: boolean;
  pagination: PaginationPayload;
};

const DEFAULT_DATA: ImagesListData = {
  images: [],
  selected: [],
  singleToDelete: undefined,
  deletingSelected: false,
  deletingSingle: false,
  displayDeleteSelectedModal: false,
  pagination: { page: 1, perPage: 10 },
};

export type ImagesListState = Pick<
  ImagesListProps,
  "workspaceSlug" | "datasetSlug" | "datasetId"
> &
  ImagesListData & {
    loading: boolean;
    setSingleToDelete: (value: string | undefined) => void;
    deleteSingle: () => Promise<void>;
    setSelected: (selected: string[]) => void;
    toggleSelectAll: () => void;
    openDeleteSelectedModal: () => void;
    closeDeleteSelectedModal: () => void;
    deleteSelected: () => Promise<void>;
  };

export const ImagesListContext = createContext({} as ImagesListState);

export type ImagesListProviderProps = PropsWithChildren<ImagesListProps>;

type SetImagesListData = Dispatch<SetStateAction<ImagesListData>>;

const useImages = (
  { datasetId }: Pick<ImagesListProps, "datasetId">,
  {
    pagination: { page: lastPage, perPage: lastPerPage },
    selected: lastSelected,
  }: ImagesListData,
  setData: SetImagesListData
): ImagesListState["loading"] => {
  const { page, perPage, itemCount } = usePagination();
  const handleCompleted = useCallback(
    ({ images }: PaginatedImagesQuery) => {
      const selected =
        page === lastPage && perPage === lastPerPage
          ? lastSelected.filter((id) => images.some((image) => image.id === id))
          : [];
      setData({
        ...DEFAULT_DATA,
        pagination: { page, perPage },
        images,
        selected,
      });
    },
    [lastPage, lastPerPage, lastSelected, page, perPage, setData]
  );
  const { loading } = useQuery<
    PaginatedImagesQuery,
    PaginatedImagesQueryVariables
  >(PAGINATED_IMAGES_QUERY, {
    variables: {
      datasetId,
      first: perPage,
      skip: (page - 1) * perPage,
    },
    skip: isEmpty(datasetId) || itemCount === 0,
    onCompleted: handleCompleted,
    // Must be active so that onCompleted is also called with refetchQueries
    // https://github.com/apollographql/react-apollo/issues/3709
    notifyOnNetworkStatusChange: true,
  });
  return isEmpty(datasetId) || loading;
};

const useSetSelected = (
  setData: SetImagesListData
): ImagesListState["setSelected"] =>
  useCallback(
    (selected: string[]) =>
      setData((prevState) => ({ ...prevState, selected })),
    [setData]
  );

const useToggleSelectAll = (
  setData: SetImagesListData
): ImagesListState["toggleSelectAll"] =>
  useCallback(
    () =>
      setData((prevState) => ({
        ...prevState,
        selected: isEmpty(prevState.selected)
          ? prevState.images.map((image) => image.id)
          : [],
      })),
    [setData]
  );

type UseDeleteSingleResult = Pick<
  ImagesListState,
  "deleteSingle" | "deletingSingle" | "setSingleToDelete"
>;

const useDeleteSingle = (
  { datasetId }: ImagesListProps,
  { singleToDelete }: ImagesListData,
  setData: SetImagesListData
): UseDeleteSingleResult => {
  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deleteImage, { loading: deletingSingle }] = useMutation<
    DeleteImageMutation,
    DeleteImageMutationVariables
  >(DELETE_IMAGE_MUTATION, {
    update: async (cache) => {
      await flushPaginatedImagesCache();
      cache.evict({ id: `Dataset:${datasetId}` });
    },
    refetchQueries: [DATASET_IMAGES_PAGE_DATASET_QUERY, PAGINATED_IMAGES_QUERY],
    awaitRefetchQueries: true,
    onError: useApolloErrorToast(),
  });
  const deleteSingle = useCallback(async () => {
    if (isNil(singleToDelete) || isEmpty(singleToDelete)) return;
    await deleteImage({ variables: { id: singleToDelete } });
  }, [deleteImage, singleToDelete]);
  const setSingleToDelete = useCallback(
    (value: string | undefined) =>
      setData((prevState) => ({ ...prevState, singleToDelete: value })),
    [setData]
  );
  return { deletingSingle, deleteSingle, setSingleToDelete };
};

const useDeleteSelected = (
  { datasetId }: ImagesListProps,
  { selected }: ImagesListData,
  setData: SetImagesListData
): Pick<
  ImagesListState,
  | "openDeleteSelectedModal"
  | "closeDeleteSelectedModal"
  | "deleteSelected"
  | "deletingSelected"
> => {
  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deleteImages, { loading }] = useMutation<
    DeleteManyImagesMutation,
    DeleteManyImagesMutationVariables
  >(DELETE_MANY_IMAGES_MUTATION, {
    update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }),
    refetchQueries: [DATASET_IMAGES_PAGE_DATASET_QUERY, PAGINATED_IMAGES_QUERY],
    awaitRefetchQueries: true,
    onError: useApolloErrorToast(),
  });
  const openDeleteSelectedModal = useCallback(
    () =>
      setData((prevState) => ({
        ...prevState,
        displayDeleteSelectedModal: true,
      })),
    [setData]
  );
  const closeDeleteSelectedModal = useCallback(
    () =>
      setData((prevState) => ({
        ...prevState,
        displayDeleteSelectedModal: false,
      })),
    [setData]
  );
  const deleteSelected = useCallback(async () => {
    await flushPaginatedImagesCache();
    await deleteImages({ variables: { id: selected } });
  }, [deleteImages, flushPaginatedImagesCache, selected]);
  return {
    openDeleteSelectedModal,
    closeDeleteSelectedModal,
    deleteSelected,
    deletingSelected: loading,
  };
};

const useProvider = (
  props: Omit<ImagesListProviderProps, "children">
): ImagesListState => {
  const [data, setData] = useState<ImagesListData>(DEFAULT_DATA);
  return {
    ...props,
    ...data,
    loading: useImages(props, data, setData),
    toggleSelectAll: useToggleSelectAll(setData),
    ...useDeleteSingle(props, data, setData),
    ...useDeleteSelected(props, data, setData),
    setSelected: useSetSelected(setData),
  };
};

export const ImagesListProvider = ({
  children,
  ...props
}: ImagesListProviderProps) => (
  <ImagesListContext.Provider value={useProvider(props)}>
    {children}
  </ImagesListContext.Provider>
);

export const useImagesList = () => {
  return useContext(ImagesListContext);
};
