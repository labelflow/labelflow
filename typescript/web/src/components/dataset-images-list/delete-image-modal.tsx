import { gql, useQuery, useMutation } from "@apollo/client";
import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import {
  paginatedImagesQuery,
  useFlushPaginatedImagesCache,
} from "./paginated-images-query";

const getImageByIdQuery = gql`
  query getImageById($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

const deleteImageMutation = gql`
  mutation deleteImage($id: ID!) {
    deleteImage(where: { id: $id }) {
      id
    }
  }
`;

export const DeleteImageModal = ({
  isOpen = false,
  onClose = () => {},
  imageId,
  datasetId,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  imageId?: string | null;
  datasetId: string;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery(getImageByIdQuery, {
    variables: { id: imageId },
    skip: imageId == null,
  });

  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deleteImage, { loading: deleteImageLoading }] =
    useMutation(deleteImageMutation);

  const handleDeleteButtonClick = async () => {
    await flushPaginatedImagesCache();
    await deleteImage({
      variables: { id: imageId },
      refetchQueries: ["getDatasetData", paginatedImagesQuery],
    });
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
            Delete image {data?.image?.name}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Labels linked to this image will be deleted. This
            action can not be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              disabled={deleteImageLoading}
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel delete"
            >
              Cancel
            </Button>
            <Button
              disabled={deleteImageLoading}
              colorScheme="red"
              onClick={handleDeleteButtonClick}
              aria-label="Confirm deleting image"
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
