import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { RefObject } from "react";

export type ModalBodyProps = {
  isOpen: boolean;
  cancelRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
  loading: boolean;
  handleDeleteButtonClick: () => Promise<void>;
  header: string;
  body: string;
};
export const DeleteModal = ({
  isOpen,
  cancelRef,
  onClose,
  loading,
  handleDeleteButtonClick,
  header,
  body,
}: ModalBodyProps) => (
  <AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={cancelRef}
    onClose={onClose}
    isCentered
  >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader>{header}</AlertDialogHeader>
        <AlertDialogBody>{body}</AlertDialogBody>
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
