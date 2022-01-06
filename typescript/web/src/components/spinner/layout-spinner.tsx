import { Center, SpinnerProps } from "@chakra-ui/react";
import { Spinner } from "./spinner";

export const LayoutSpinner = (props: SpinnerProps) => (
  <Center h="full">
    <Spinner size="xl" {...props} />
  </Center>
);
