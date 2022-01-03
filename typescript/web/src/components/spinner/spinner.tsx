import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";
import React from "react";

export const Spinner = (props: SpinnerProps) => {
  return <ChakraSpinner emptyColor="gray.200" {...props} />;
};
