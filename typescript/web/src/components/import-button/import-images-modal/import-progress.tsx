import { chakra, Tooltip, TooltipProps } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";
import {
  RiCheckboxCircleFill,
  RiContrastFill,
  RiErrorWarningFill,
} from "react-icons/ri";
import { UploadInfo } from "./types";

export type ImportProgressTooltipProps = Pick<
  TooltipProps,
  "label" | "color" | "aria-label"
> & { icon: IconType };

const getErrorProps = (
  error: string | undefined
): ImportProgressTooltipProps => ({
  label: error ?? "Unknown error",
  icon: RiErrorWarningFill,
  color: "red.500",
  "aria-label": "Error indicator",
});

const UPLOADED_PROPS: ImportProgressTooltipProps = {
  label: "Upload succeed",
  icon: RiCheckboxCircleFill,
  color: "green.500",
  "aria-label": "Upload succeed",
};

const UPLOADING_PROPS: ImportProgressTooltipProps = {
  label: "Upload in progress",
  icon: RiContrastFill,
  color: "gray.800",
  "aria-label": "Loading indicator",
};

const getTooltipProps = ({
  status,
  error,
}: ImportProgressProps): ImportProgressTooltipProps => {
  if (status === "error") return getErrorProps(error);
  return status === "uploaded" ? UPLOADED_PROPS : UPLOADING_PROPS;
};

export const ImportProgressTooltip = ({
  icon,
  label,
  color,
  "aria-label": ariaLabel,
}: ImportProgressTooltipProps) => {
  const Icon = chakra(icon);
  return (
    <Tooltip label={label} placement="left">
      <span>
        <Icon
          display="inline-block"
          fontSize="xl"
          color={color}
          aria-label={ariaLabel}
          data-testid="import-progress-tooltip-icon"
        />
      </span>
    </Tooltip>
  );
};

export type ImportProgressProps = Pick<UploadInfo, "status" | "error">;

export const ImportProgress = (props: ImportProgressProps) => (
  <ImportProgressTooltip {...getTooltipProps(props)} />
);
