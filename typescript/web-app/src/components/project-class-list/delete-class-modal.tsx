import { gql, useQuery, useApolloClient } from "@apollo/client";
import { useRef, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

const getLabelClassByIdQuery = gql`
  query getLabelClassById($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
    }
  }
`;

const deleteLabelClassMutation = gql`
  mutation deleteLabelClass($id: ID!) {
    deleteLabelClass(where: { id: $id }) {
      id
    }
  }
`;

export const DeleteLabelClassModal = ({
  isOpen = false,
  onClose = () => {},
  labelClassId,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  labelClassId: string | null;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery(getLabelClassByIdQuery, {
    variables: { id: labelClassId },
    skip: labelClassId == null,
  });
  const client = useApolloClient();

  const deleteLabelClass = useCallback(() => {
    const deletePromise = client.mutate({
      mutation: deleteLabelClassMutation,
      variables: { id: labelClassId },
      refetchQueries: ["getProjectLabelClasses"],
    });
    onClose();
    return deletePromise;
  }, [labelClassId, client, onClose]);

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
            Delete Class {data?.labelClass?.name}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Labels linked to this class will be set to the class
            None. This action can not be undone.
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
              onClick={deleteLabelClass}
              aria-label="Delete label class"
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
