import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
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
            setCloseable={setCloseable}
          />
        )}
        {mode === "urlList" && (
          <ImportImagesModalUrlList
            setMode={setMode}
            setCloseable={setCloseable}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
