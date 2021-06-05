import { Tooltip, chakra } from "@chakra-ui/react";

import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiContrastFill,
} from "react-icons/ri";

export const SucceedIcon = chakra(RiCheckboxCircleFill);
export const LoadingIcon = chakra(RiContrastFill);
export const ErrorIcon = chakra(RiErrorWarningFill);

export const ImportProgress = ({ status }: { status: boolean | string }) => {
  if (typeof status === "string") {
    return (
      <Tooltip label={status} placement="left">
        <span>
          <ErrorIcon
            display="inline-block"
            fontSize="xl"
            color="red.500"
            aria-label="Error indicator"
          />
        </span>
      </Tooltip>
    );
  }

  if (status) {
    return (
      <Tooltip label="Upload succeed" placement="left">
        <span>
          <SucceedIcon
            display="inline-block"
            fontSize="xl"
            color="green.500"
            aria-label="Upload succeed"
          />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip label="Loading indicator" placement="left">
      <span>
        <LoadingIcon
          display="inline-block"
          fontSize="xl"
          color="gray.800"
          aria-label="Loading indicator"
        />
      </span>
    </Tooltip>
  );
};
