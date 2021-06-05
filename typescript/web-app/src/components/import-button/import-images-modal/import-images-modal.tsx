import { useState } from "react";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
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
        console.log("CLOOOSE");
        // setFiles([]);
        // setFileUploadStatuses({});
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent height="80vh">
        {mode === "dropzone" && (
          <ImportImagesModalDropzone
            isOpen={isOpen}
            onClose={onClose}
            setMode={setMode}
            isCloseable={isCloseable}
            setCloseable={setCloseable}
          />
        )}
        {mode === "urlList" && (
          <ImportImagesModalUrlList
            isOpen={isOpen}
            onClose={onClose}
            setMode={setMode}
            isCloseable={isCloseable}
            setCloseable={setCloseable}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
