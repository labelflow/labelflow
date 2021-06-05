import { Button, ButtonProps, useDisclosure, chakra } from "@chakra-ui/react";

import { RiUploadCloud2Line } from "react-icons/ri";
import { ImportImagesModal } from "./import-images-modal";

const UploadIcon = chakra(RiUploadCloud2Line);

type Props = ButtonProps;

export const ImportButton = ({ ...props }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <ImportImagesModal isOpen={isOpen} onClose={onClose} />
      <Button
        aria-label="Add images"
        leftIcon={<UploadIcon fontSize="xl" />}
        onClick={onOpen}
        variant="ghost"
        {...props}
      >
        Add images
      </Button>
    </>
  );
};
