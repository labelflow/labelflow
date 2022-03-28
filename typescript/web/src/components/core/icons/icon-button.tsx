import {
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
} from "@chakra-ui/react";
import { AppIcon } from "./app-icons";
import { Icon } from "./icon";

type IconButtonProps = Omit<ChakraIconButtonProps, "icon" | "aria-label"> & {
  label: string;
  icon: AppIcon;
  tooltipLabel?: string;
};

export const IconButton = ({
  label,
  tooltipLabel = label,
  icon,
  fontSize = "lg",
  variant = "ghost",
  ...props
}: IconButtonProps) => (
  <Tooltip label={tooltipLabel} openDelay={300}>
    <ChakraIconButton
      aria-label={label}
      icon={<Icon name={icon} />}
      variant={variant}
      fontSize={fontSize}
      {...props}
    />
  </Tooltip>
);
