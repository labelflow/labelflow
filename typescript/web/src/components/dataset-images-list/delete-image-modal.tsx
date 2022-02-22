import { gql, useMutation, useQuery } from "@apollo/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { useRef } from "react";
import {
  GetImageByIdQuery,
  GetImageByIdQueryVariables,
} from "../../graphql-types/GetImageByIdQuery";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import {
  PAGINATED_IMAGES_QUERY,
  useFlushPaginatedImagesCache,
} from "./paginated-images-query";

const GET_IMAGE_BY_ID_QUERY = gql`
  query GetImageByIdQuery($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImageMutation($id: ID!) {
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
  const { data } = useQuery<GetImageByIdQuery, GetImageByIdQueryVariables>(
    GET_IMAGE_BY_ID_QUERY,
    {
      variables: { id: imageId ?? "" },
      skip: isEmpty(imageId),
    }
  );

  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deleteImage, { loading: deleteImageLoading }] = useMutation(
    DELETE_IMAGE_MUTATION,
    { update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }) }
  );
  const handleDeleteButtonClick = async () => {
    await flushPaginatedImagesCache();
    await deleteImage({
      variables: { id: imageId },
      refetchQueries: [
        DATASET_IMAGES_PAGE_DATASET_QUERY,
        PAGINATED_IMAGES_QUERY,
      ],
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
