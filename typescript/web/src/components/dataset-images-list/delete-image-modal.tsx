import { gql, useMutation } from "@apollo/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import {
  DeleteManyImagesMutation,
  DeleteManyImagesMutationVariables,
} from "../../graphql-types";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
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

export const DeleteImageModal = ({
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
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {`Delete ${imagesSelected.length} image${
              imagesSelected.length > 1 ? "s" : ""
            }`}
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? Labels linked to this image will be deleted. This
            action can not be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              disabled={loading}
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel delete"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              colorScheme="red"
              onClick={handleDeleteButtonClick}
              aria-label="Confirm deleting image"
              ml={3}
              isLoading={loading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
