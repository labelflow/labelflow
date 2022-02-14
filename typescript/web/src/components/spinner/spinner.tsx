import {
  Spinner as ChakraSpinner,
  SpinnerProps,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import React from "react";

export const Spinner = (props: SpinnerProps) => {
  return (
    <ChakraSpinner
      aria-label="loading indicator"
      emptyColor={mode("gray.200", "gray.800")}
      {...props}
    />
  );
};
