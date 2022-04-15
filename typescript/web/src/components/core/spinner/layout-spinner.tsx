import { Flex, SpinnerProps } from "@chakra-ui/react";
import { Spinner } from "./spinner";

export const LayoutSpinner = (props: SpinnerProps) => (
  <Flex flexGrow={1} align="center" justify="center">
    <Spinner size="xl" {...props} />
  </Flex>
);
