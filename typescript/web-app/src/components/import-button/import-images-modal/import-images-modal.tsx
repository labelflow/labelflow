import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ImportImagesModalDropzone } from "./modal-dropzone/modal-dropzone";
import { ImportImagesModalUrlList } from "./modal-url-list/modal-url-list";

export const ImportImagesModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const [isCloseable, setCloseable] = useState(true);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [mode, setMode] = useState<"dropzone" | "urlList">("dropzone");

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        if (!isCloseable) return;
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalCloseButton disabled={!isCloseable} />
        {mode === "dropzone" && (
          <ImportImagesModalDropzone
            setMode={setMode}
            onUploadStart={() => {
              setCloseable(false);
            }}
            onUploadEnd={() => {
              setCloseable(true);
              setHasUploaded(true);
            }}
          />
        )}
        {mode === "urlList" && (
          <ImportImagesModalUrlList
            setMode={setMode}
            onUploadStart={() => {
              setCloseable(false);
            }}
            onUploadEnd={() => {
              setCloseable(true);
              setHasUploaded(true);
            }}
          />
        )}
        <ModalFooter
          justifyContent="center"
          visibility={hasUploaded ? "visible" : "hidden"}
        >
          <Button colorScheme="brand" onClick={onClose}>
            Start labeling
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
