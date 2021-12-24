import React from "react";
import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";

type CustomSpinnerProps = SpinnerProps & {
  ariaLabel?: string;
  ref?: React.Ref<HTMLDivElement>;
};
export const Spinner = ({
  id,
  color = "black",
  ariaLabel,
  size = "xl",
  visibility = "visible",
  key,
  ref,
}: CustomSpinnerProps) => {
  return (
    <ChakraSpinner
      id={id}
      aria-label={ariaLabel}
      emptyColor="gray.200"
      color={color}
      size={size}
      visibility={visibility}
      key={key}
      ref={ref}
    />
  );
};
