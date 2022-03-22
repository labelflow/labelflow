import { Tooltip as ChakraTooltip, TooltipProps } from "@chakra-ui/react";

export const Tooltip = ({ openDelay = 300, ...props }: TooltipProps) => (
  <ChakraTooltip openDelay={openDelay} {...props} />
);
