import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { FormEvent, useCallback } from "react";
import { useWorkspaceSettings } from "../context";
import { DeleteWorkspaceWarning } from "./delete-workspace-warning";
import { useDeleteWorkspace } from "./delete-workspace.state";
import { WorkspaceNameConfirm } from "./workspace-name-confirm";

const Header = () => {
  const { name } = useWorkspaceSettings();
  return (
    <ModalHeader>{`Are you sure you want to delete the ${name} workspace?`}</ModalHeader>
  );
};

const Body = () => (
  <ModalBody>
    <Stack spacing="1em">
      <DeleteWorkspaceWarning />
      <WorkspaceNameConfirm />
    </Stack>
  </ModalBody>
);

const CancelButton = () => {
  const { isDeleting, close } = useDeleteWorkspace();
  return (
    <Button isDisabled={isDeleting} onClick={close}>
      Cancel
    </Button>
  );
};

const DeleteWorkspaceButton = () => {
  const { canDelete, isDeleting } = useDeleteWorkspace();
  return (
    <Button
      type="submit"
      isDisabled={!canDelete}
      isLoading={isDeleting}
      colorScheme="red"
    >
      Delete workspace
    </Button>
  );
};

const Footer = () => (
  <ModalFooter>
    <HStack spacing=".5em">
      <CancelButton />
      <DeleteWorkspaceButton />
    </HStack>
  </ModalFooter>
);

const useOnSubmit = () => {
  const { deleteWorkspace } = useDeleteWorkspace();
  return useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      deleteWorkspace();
    },
    [deleteWorkspace]
  );
};

const CloseModalButton = () => {
  const { isDeleting } = useDeleteWorkspace();
  return <ModalCloseButton isDisabled={isDeleting} />;
};

const Form = () => {
  const handleSubmit = useOnSubmit();
  return (
    <form onSubmit={handleSubmit}>
      <Header />
      <Body />
      <Footer />
    </form>
  );
};

const Content = () => (
  <ModalContent height="auto">
    <Form />
    <CloseModalButton />
  </ModalContent>
);

export const DeleteWorkspaceModal = () => {
  const { isDeleting, isOpen, close } = useDeleteWorkspace();
  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      closeOnEsc={!isDeleting}
      closeOnOverlayClick={!isDeleting}
      isCentered
      size="2xl"
    >
      <ModalOverlay />
      <Content />
    </Modal>
  );
};
