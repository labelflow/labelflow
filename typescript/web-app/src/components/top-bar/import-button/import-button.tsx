import { Button, useDisclosure, chakra } from "@chakra-ui/react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { ImportImagesModal } from "./import-images-modal";

const UploadIcon = chakra(RiUploadCloud2Line);

export const ImportButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <ImportImagesModal isOpen={isOpen} onClose={onClose} />
      <Button
        aria-label="Add images"
        leftIcon={<UploadIcon />}
        onClick={onOpen}
        variant="ghost"
      >
        Add images
      </Button>
    </>
  );
};
