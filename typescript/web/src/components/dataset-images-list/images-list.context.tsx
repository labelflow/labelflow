import { gql, useMutation, useQuery } from "@apollo/client";
import { useBoolean, useControllableState } from "@chakra-ui/react";
import { isNil, isEmpty } from "lodash/fp";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { SetRequired } from "type-fest";
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
import { usePagination } from "../pagination/pagination.context";
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
  onChangeSelected?: (selected: string[]) => void;
  singleToDelete?: string;
  onChangeSingleToDelete?: (value: string | undefined) => void;
};

export type ImagesListState = SetRequired<
  Pick<
    ImagesListProps,
    | "workspaceSlug"
    | "datasetSlug"
    | "datasetId"
    | "selected"
    | "singleToDelete"
  >,
  "selected"
> & {
  loading: boolean;
  images: PaginatedImagesQuery_images[];
  setSingleToDelete: (value: string | undefined) => void;
  deleteSingle: () => Promise<void>;
  deletingSingle: boolean;
  setSelected: Dispatch<SetStateAction<string[]>>;
  toggleSelectAll: () => void;
  displayDeleteSelectedModal: boolean;
  openDeleteSelectedModal: () => void;
  closeDeleteSelectedModal: () => void;
  deleteSelected: () => Promise<void>;
  deletingSelected: boolean;
};

export const ImagesListContext = createContext({} as ImagesListState);

export type ImagesListProviderProps = PropsWithChildren<ImagesListProps>;

const useImages = ({
  datasetId,
}: Pick<ImagesListProps, "datasetId">): Pick<
  ImagesListState,
  "images" | "loading"
> => {
  const { page, perPage, itemCount } = usePagination();
  const { data: imagesResult, loading } = useQuery<
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
  return {
    images: imagesResult?.images ?? [],
    loading: isEmpty(datasetId) || loading,
  };
};

type UseSelectionOptions = Pick<
  ImagesListProps,
  "selected" | "onChangeSelected"
> &
  Pick<ImagesListState, "images">;

const useSelection = ({
  images,
  selected: selectedProp,
  onChangeSelected,
}: UseSelectionOptions): Pick<
  ImagesListState,
  "selected" | "setSelected" | "toggleSelectAll"
> => {
  const [selected, setSelected] = useControllableState<string[]>({
    defaultValue: [],
    value: selectedProp,
    onChange: onChangeSelected,
  });
  const toggleSelectAll = useCallback(
    () => setSelected(isEmpty(selected) ? images.map((image) => image.id) : []),
    [images, selected, setSelected]
  );
  return { selected, setSelected, toggleSelectAll };
};

type UseDeleteSingleOptions = Pick<
  ImagesListProps,
  "singleToDelete" | "onChangeSingleToDelete"
> &
  Pick<ImagesListState, "datasetId" | "selected" | "setSelected">;

type UseDeleteSingleResult = Pick<
  ImagesListState,
  "singleToDelete" | "setSingleToDelete" | "deleteSingle" | "deletingSingle"
>;

const useDeleteSingle = ({
  datasetId,
  selected,
  setSelected,
  singleToDelete: singleToDeleteProp,
  onChangeSingleToDelete,
}: UseDeleteSingleOptions): UseDeleteSingleResult => {
  const [singleToDelete, setSingleToDelete] = useControllableState<
    string | undefined
  >({
    defaultValue: undefined,
    value: singleToDeleteProp,
    onChange: onChangeSingleToDelete,
  });
  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deleteImage, { loading: deletingSingle }] = useMutation<
    DeleteImageMutation,
    DeleteImageMutationVariables
  >(DELETE_IMAGE_MUTATION, {
    update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }),
  });
  const deleteSingle = useCallback(async () => {
    if (isNil(singleToDelete) || isEmpty(singleToDelete)) return;
    await flushPaginatedImagesCache();
    await deleteImage({
      variables: { id: singleToDelete },
      refetchQueries: [
        DATASET_IMAGES_PAGE_DATASET_QUERY,
        PAGINATED_IMAGES_QUERY,
      ],
      awaitRefetchQueries: true,
    });
    setSelected(selected.filter((id) => id !== singleToDelete));
  }, [
    deleteImage,
    flushPaginatedImagesCache,
    selected,
    setSelected,
    singleToDelete,
  ]);
  return { deletingSingle, singleToDelete, setSingleToDelete, deleteSingle };
};

const useDeleteSelected = ({
  datasetId,
  selected,
  setSelected,
}: Pick<ImagesListState, "datasetId" | "selected" | "setSelected">): Pick<
  ImagesListState,
  | "displayDeleteSelectedModal"
  | "openDeleteSelectedModal"
  | "closeDeleteSelectedModal"
  | "deleteSelected"
  | "deletingSelected"
> => {
  const [
    displayDeleteSelectedModal,
    { on: openDeleteSelectedModal, off: closeDeleteSelectedModal },
  ] = useBoolean(false);
  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deletedImagesIds, { loading }] = useMutation<
    DeleteManyImagesMutation,
    DeleteManyImagesMutationVariables
  >(DELETE_MANY_IMAGES_MUTATION, {
    update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }),
  });

  const deleteSelected = useCallback(async () => {
    await flushPaginatedImagesCache();
    await deletedImagesIds({
      variables: { id: selected },
      refetchQueries: [
        DATASET_IMAGES_PAGE_DATASET_QUERY,
        PAGINATED_IMAGES_QUERY,
      ],
      awaitRefetchQueries: true,
    });
    setSelected([]);
  }, [deletedImagesIds, flushPaginatedImagesCache, selected, setSelected]);
  return {
    displayDeleteSelectedModal,
    openDeleteSelectedModal,
    closeDeleteSelectedModal,
    deleteSelected,
    deletingSelected: loading,
  };
};

const useProvider = (
  props: Omit<ImagesListProviderProps, "children">
): ImagesListState => {
  const { images, loading: loadingImages } = useImages(props);
  const selectionState = useSelection({ ...props, images });
  const { deletingSingle, ...deleteSingleState } = useDeleteSingle({
    ...props,
    ...selectionState,
  });
  const { deletingSelected, ...deleteSelectedState } = useDeleteSelected({
    ...props,
    ...selectionState,
  });
  return {
    ...props,
    images,
    ...selectionState,
    loading: loadingImages || deletingSingle || deletingSelected,
    ...deleteSingleState,
    deletingSingle,
    ...deleteSelectedState,
    deletingSelected,
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
