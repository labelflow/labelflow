import { gql, useMutation } from "@apollo/client";
import { useRef } from "react";
import {
  DeleteManyImagesMutation,
  DeleteManyImagesMutationVariables,
} from "../../graphql-types";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import { DeleteModal } from "./delete-modal";
import { useImagesList } from "./images-list.context";
import {
  PAGINATED_IMAGES_QUERY,
  useFlushPaginatedImagesCache,
} from "./paginated-images-query";

const DELETE_MANY_IMAGES_MUTATION = gql`
  mutation DeleteManyImagesMutation($imagesIds: [ID!]!) {
    deleteManyImages(where: { imagesIds: $imagesIds }) {
      id
    }
  }
`;

export const DeleteManyImagesModal = ({
  isOpen = false,
  onClose = () => {},
  datasetId,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  datasetId: string;
}) => {
  const { imagesSelected, setImagesSelected } = useImagesList();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deletedImagesIds, { loading }] = useMutation<
    DeleteManyImagesMutation,
    DeleteManyImagesMutationVariables
  >(DELETE_MANY_IMAGES_MUTATION, {
    update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }),
  });

  const handleDeleteButtonClick = async () => {
    await flushPaginatedImagesCache();
    await deletedImagesIds({
      variables: { imagesIds: imagesSelected },
      refetchQueries: [
        DATASET_IMAGES_PAGE_DATASET_QUERY,
        PAGINATED_IMAGES_QUERY,
      ],
    });
    setImagesSelected([]);
    onClose();
  };
  return (
    <DeleteModal
      isOpen={isOpen}
      cancelRef={cancelRef}
      onClose={onClose}
      loading={loading}
      handleDeleteButtonClick={handleDeleteButtonClick}
      header={`Delete ${imagesSelected.length} image${
        imagesSelected.length > 1 ? "s" : ""
      }`}
      body="Are you sure? Every labels will also be deleted. This action can not be undone"
    />
  );
};
