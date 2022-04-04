import {
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
} from "@chakra-ui/react";

export type TooltipProps = ChakraTooltipProps;

export const Tooltip = ({
  openDelay = 300,
  children,
  ...props
}: TooltipProps) => (
  <ChakraTooltip openDelay={openDelay} {...props}>
    {children}
  </ChakraTooltip>
);
