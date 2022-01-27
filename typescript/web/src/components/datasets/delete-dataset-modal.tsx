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
import { getDatasetByIdQuery } from "./datasets.query";

export const deleteDatasetByIdMutation = gql`
  mutation deleteDatasetById($id: ID!) {
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
  const { data } = useQuery(getDatasetByIdQuery, {
    variables: { id: datasetId },
    skip: datasetId == null,
  });

  const [deleteDatasetMutate, { loading }] = useMutation(
    deleteDatasetByIdMutation,
    {
      variables: { id: datasetId },
      refetchQueries: ["getDatasets"],
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
