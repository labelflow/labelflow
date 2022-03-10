import { chakra, ChakraComponent, Tooltip } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";
import {
  RiCheckboxCircleFill,
  RiContrastFill,
  RiErrorWarningFill,
} from "react-icons/ri";
import { UploadInfo } from "./types";

export const SucceedIcon = chakra(RiCheckboxCircleFill);
export const LoadingIcon = chakra(RiContrastFill);
export const ErrorIcon = chakra(RiErrorWarningFill);

export type ImportProgressTooltipProps = {
  label: string;
  icon: ChakraComponent<IconType, {}>;
  color: string;
  "aria-label": string;
};

export const ImportProgressTooltip = ({
  label,
  icon,
  color,
  "aria-label": ariaLabel,
}: ImportProgressTooltipProps) => {
  const IconComponent = icon;
  return (
    <Tooltip label={label} placement="left">
      <span>
        <IconComponent
          display="inline-block"
          fontSize="xl"
          color={color}
          aria-label={ariaLabel}
        />
      </span>
    </Tooltip>
  );
};

export type ImportProgressProps = Pick<UploadInfo, "status" | "error">;

export const ImportProgress = ({ status, error }: ImportProgressProps) => {
  switch (status) {
    case "error":
      return (
        <ImportProgressTooltip
          label={error ?? "Unknown error"}
          icon={ErrorIcon}
          color="red.500"
          aria-label="Error indicator"
        />
      );
    case "uploaded":
      return (
        <ImportProgressTooltip
          label="Upload succeed"
          icon={SucceedIcon}
          color="green.500"
          aria-label="Upload succeed"
        />
      );
    default:
      return (
        <ImportProgressTooltip
          label="Upload in progress"
          icon={LoadingIcon}
          color="gray.800"
          aria-label="Loading indicator"
        />
      );
  }
};
