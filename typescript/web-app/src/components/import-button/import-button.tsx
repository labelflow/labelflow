import { Button, ButtonProps, chakra } from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";

import { RiUploadCloud2Line } from "react-icons/ri";
import { BoolParam } from "../../utils/query-param-bool";
import { ImportImagesModal } from "./import-images-modal";

const UploadIcon = chakra(RiUploadCloud2Line);

type Props = ButtonProps;

export const ImportButton = ({ ...props }: Props) => {
  const [isOpen, setIsOpen] = useQueryParam("modal-import", BoolParam);

  return (
    <>
      <ImportImagesModal
        isOpen={isOpen ?? false}
        onClose={() => setIsOpen(false, "replaceIn")}
      />
      <Button
        aria-label="Add images"
        leftIcon={<UploadIcon fontSize="xl" />}
        onClick={() => setIsOpen(true, "replaceIn")}
        variant="ghost"
        {...props}
      >
        Add images
      </Button>
    </>
  );
};
