import {
  Spinner as ChakraSpinner,
  SpinnerProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export const Spinner = (props: SpinnerProps) => (
  <ChakraSpinner
    aria-label="loading indicator"
    emptyColor={useColorModeValue("gray.200", "gray.800")}
    {...props}
  />
);
