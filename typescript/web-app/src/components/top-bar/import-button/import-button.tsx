import { Button, useDisclosure, chakra } from "@chakra-ui/react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { ImportImagesModal } from "./import-images-modal";

const UploadIcon = chakra(RiUploadCloud2Line);

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
      <Button
        aria-label="import"
        leftIcon={<UploadIcon />}
        onClick={onOpen}
        variant="ghost"
      >
        Import
      </Button>
    </>
  );
};
