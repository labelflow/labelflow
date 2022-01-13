import {
  Modal as ChakraModal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  ExportModalProps,
  ExportModalProvider,
  useExportModal,
} from "./export-modal.context";
import { ExportOptionsModal } from "./export-options-modal";
import { ModalBody } from "./modal-body";
import { ModalHeader } from "./modal-header";

const Modal = () => {
  const { isOpen, onClose } = useExportModal();

  return (
    <>
      <ChakraModal
        scrollBehavior="inside"
        isOpen={isOpen}
        size="3xl"
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent height="auto">
          <ModalHeader />
          <ModalBody />
          <ModalCloseButton />
        </ModalContent>
      </ChakraModal>
      <ExportOptionsModal />
    </>
  );
};

export const ExportModal = (props: ExportModalProps) => (
  <ExportModalProvider {...props}>
    <Modal />
  </ExportModalProvider>
);
