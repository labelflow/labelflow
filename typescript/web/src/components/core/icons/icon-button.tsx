import {
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import { Tooltip, TooltipProps } from "../tooltip";
import { AppIcon } from "./app-icons";
import { Icon } from "./icon";

type IconButtonProps = Omit<ChakraIconButtonProps, "icon" | "aria-label"> & {
  label: string;
  icon: AppIcon | NonNullable<ChakraIconButtonProps["icon"]>;
  tooltip?: string | Omit<TooltipProps, "children">;
};

const useTooltipProps = (
  tooltip: IconButtonProps["tooltip"] = {}
): Omit<TooltipProps, "children"> =>
  typeof tooltip === "string" ? { label: tooltip } : tooltip;

const IconComponent = ({ icon }: Pick<IconButtonProps, "icon">) => {
  return typeof icon === "string" ? <Icon name={icon} /> : icon;
};

export const IconButton = ({
  label,
  icon,
  tooltip,
  fontSize = "lg",
  variant = "ghost",
  ...props
}: IconButtonProps) => {
  const { label: tooltipLabel, ...tooltipProps } = useTooltipProps(tooltip);
  return (
    <Tooltip label={tooltipLabel ?? label} openDelay={300} {...tooltipProps}>
      <ChakraIconButton
        aria-label={label}
        icon={<IconComponent icon={icon} />}
        variant={variant}
        fontSize={fontSize}
        {...props}
      />
    </Tooltip>
  );
};
