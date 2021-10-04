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
}: {
  isOpen?: boolean;
  onClose?: () => void;
  imageId?: string | null;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery(getImageByIdQuery, {
    variables: { id: imageId },
    skip: imageId == null,
  });

  const [deleteImage] = useMutation(deleteImageMutation);

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
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel delete"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteImage({
                  variables: { id: imageId },
                  refetchQueries: ["getDatasetData"],
                });
                onClose();
              }}
              aria-label="Confirm deleting class"
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
