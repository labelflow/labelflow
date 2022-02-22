import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useCallback, useRef } from "react";
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
import {
  PAGINATED_IMAGES_QUERY,
  useFlushPaginatedImagesCache,
} from "./paginated-images-query";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import {
  GetImageByIdQuery,
  GetImageByIdQueryVariables,
} from "../../graphql-types/GetImageByIdQuery";
import { GET_ALL_IMAGES_OF_A_DATASET_QUERY } from "../../hooks/use-images-navigation.query";
import {
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables,
} from "../../graphql-types";
import { useOptionalWorkspace, useDataset } from "../../hooks";

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

const useRefetchAllImages = () => {
  const client = useApolloClient();
  const workspace = useOptionalWorkspace();
  const workspaceSlug = workspace?.slug ?? "";
  const { slug: datasetSlug } = useDataset();
  return useCallback(async () => {
    client.query<
      GetAllImagesOfADatasetQuery,
      GetAllImagesOfADatasetQueryVariables
    >({
      query: GET_ALL_IMAGES_OF_A_DATASET_QUERY,
      variables: { slug: datasetSlug, workspaceSlug },
      fetchPolicy: "network-only",
    });
  }, [client, datasetSlug, workspaceSlug]);
};

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
  const refetchAllImages = useRefetchAllImages();
  const [deleteImage, { loading: deleteImageLoading }] = useMutation(
    DELETE_IMAGE_MUTATION
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
    await refetchAllImages();
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
