import {
  chakra,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
} from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

type IconButtonProps = Omit<ChakraIconButtonProps, "icon"> & {
  tooltipLabel?: string;
  icon: IconType;
};

export const IconButton = ({
  "aria-label": ariaLabel,
  tooltipLabel = ariaLabel,
  icon,
  fontSize = "lg",
  variant = "ghost",
  ...props
}: IconButtonProps) => {
  const Icon = chakra(icon);
  return (
    <Tooltip label={tooltipLabel} openDelay={300}>
      <ChakraIconButton
        aria-label={ariaLabel}
        icon={<Icon fontSize={fontSize} />}
        variant={variant}
        {...props}
      />
    </Tooltip>
  );
};
