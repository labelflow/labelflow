import { Button, useDisclosure } from "@chakra-ui/react";
import { ImportImagesModal } from "./import-images-modal";

export const ImportButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const onImportSucceed = () => {};

  return (
    <>
      <ImportImagesModal
        isOpen={isOpen}
        onClose={onClose}
        onImportSucceed={onImportSucceed}
      />
      <Button aria-label="import" onClick={onOpen}>
        Import
      </Button>
    </>
  );
};
