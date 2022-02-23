import {
  Button,
  ButtonProps,
  chakra,
  IconButton,
  IconButtonProps,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useQueryParam } from "use-query-params";
import { trackEvent } from "../../utils/google-analytics";
import { BoolParam } from "../../utils/query-param-bool";
import { ImportImagesModal } from "./import-images-modal";

const UploadIcon = chakra(RiUploadCloud2Line);

type OpenModalButtonProps = (ButtonProps | IconButtonProps) & {
  breakpoint: "md" | "lg" | "base";
};

const OpenModalButton = ({
  breakpoint,
  disabled,
  ...props
}: OpenModalButtonProps) => {
  const uploadIcon = <UploadIcon fontSize="xl" />;
  const isIconButton = breakpoint === "md";
  const buttonProps = {
    "aria-label": "Add images",
    variant: "ghost",
    display: breakpoint === "base" ? "none" : undefined,
    flexShrink: isIconButton ? undefined : 0,
    ...props,
  };
  return isIconButton ? (
    <Tooltip label="Add images" openDelay={300}>
      <IconButton icon={uploadIcon} {...buttonProps} />
    </Tooltip>
  ) : (
    <Button leftIcon={uploadIcon} {...buttonProps}>
      Add images
    </Button>
  );
};

const ResponsiveOpenModalButton = (props: ButtonProps) => {
  const hiddenButton = <OpenModalButton breakpoint="base" {...props} />;
  return (
    useBreakpointValue({
      base: hiddenButton,
      md: <OpenModalButton breakpoint="md" {...props} />,
      lg: <OpenModalButton breakpoint="lg" {...props} />,
    }) ?? hiddenButton
    // We need to give here a default value like this for tests to pass,
    // otherwise the button is undefined and it's not findable in the tests
  );
};

export type ImportButtonProps = ButtonProps & {
  showModal?: boolean;
  datasetId?: string;
};

export const ImportButton = ({
  showModal = true,
  disabled,
  datasetId,
  ...props
}: ImportButtonProps) => {
  const { isReady } = useRouter();
  const [isOpen, setIsOpen] = useQueryParam("modal-import", BoolParam);
  const handleOpen = useCallback(() => {
    setIsOpen(true, "replaceIn");
    trackEvent("import_button_click", {});
  }, [setIsOpen]);
  return (
    <>
      {showModal && (
        <ImportImagesModal
          isOpen={isOpen ?? false}
          onClose={() => setIsOpen(false, "replaceIn")}
          datasetId={datasetId}
        />
      )}
      <ResponsiveOpenModalButton
        onClick={handleOpen}
        disabled={!isReady || disabled}
        {...props}
      />
    </>
  );
};
