import React, { useCallback } from "react";

import {
  Button,
  IconButton,
  ButtonProps,
  chakra,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";

import { RiUploadCloud2Line } from "react-icons/ri";
import { BoolParam } from "../../utils/query-param-bool";
import { ImportImagesModal } from "./import-images-modal";
import { trackEvent } from "../../utils/google-analytics";

const UploadIcon = chakra(RiUploadCloud2Line);

type Props = ButtonProps & {
  showModal?: boolean;
};

export const ImportButton = ({ showModal = true, ...props }: Props) => {
  const [isOpen, setIsOpen] = useQueryParam("modal-import", BoolParam);
  const handleOpen = useCallback(() => {
    setIsOpen(true, "replaceIn");
    trackEvent("import_button_click", {});
  }, [setIsOpen]);

  const largeButton = (
    <Button
      aria-label="Add images"
      leftIcon={<UploadIcon fontSize="xl" />}
      onClick={handleOpen}
      variant="ghost"
      {...props}
    >
      Add images
    </Button>
  );
  const hiddenButton = (
    <Button
      aria-label="Add images"
      leftIcon={<UploadIcon fontSize="xl" />}
      onClick={handleOpen}
      variant="ghost"
      display="none"
      {...props}
    >
      Add images
    </Button>
  );

  const smallButton = (
    <Tooltip label="Add images" openDelay={300}>
      <IconButton
        aria-label="Add images"
        icon={<UploadIcon fontSize="xl" />}
        onClick={handleOpen}
        variant="ghost"
        {...props}
      />
    </Tooltip>
  );

  const button =
    useBreakpointValue({
      base: hiddenButton,
      md: smallButton,
      lg: largeButton,
    }) ?? hiddenButton; // We need to give here a default value like this for tests to pass, otherwise the button is undefined and it's not findable in the tests

  return (
    <>
      {showModal && (
        <ImportImagesModal
          isOpen={isOpen ?? false}
          onClose={() => setIsOpen(false, "replaceIn")}
        />
      )}
      {button}
    </>
  );
};
