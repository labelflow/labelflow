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
import { useRef } from "react";
import { GET_DATASETS_QUERY } from "../../utils/shared-queries";
import { GET_DATASET_BY_ID_QUERY } from "./datasets.query";

const DELETE_DATASET_BY_ID_MUTATION = gql`
  mutation DeleteDatasetByIdMutation($id: ID!) {
    deleteDataset(where: { id: $id }) {
      id
    }
  }
`;

export const DeleteDatasetModal = ({
  isOpen = false,
  onClose = () => {},
  datasetId = undefined,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  datasetId?: string;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery(GET_DATASET_BY_ID_QUERY, {
    variables: { id: datasetId },
    skip: datasetId == null,
  });

  const [deleteDatasetMutate, { loading }] = useMutation(
    DELETE_DATASET_BY_ID_MUTATION,
    {
      variables: { id: datasetId },
      refetchQueries: [GET_DATASETS_QUERY],
      update: (cache) => {
        // Avoid issue https://github.com/labelflow/labelflow/issues/563
        cache.evict({ id: `Dataset:${datasetId}` });
      },
    }
  );

  const deleteDataset = async () => {
    await deleteDatasetMutate();
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
            Delete Dataset {data?.dataset?.name}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Images, Labels and Classes will be deleted. This
            action cannot be undone.
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
              isLoading={loading}
              loadingText="Deleting..."
              onClick={deleteDataset}
              aria-label="Dataset delete"
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
