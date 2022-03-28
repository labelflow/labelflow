import { Center, SpinnerProps } from "@chakra-ui/react";
import { Spinner } from "./spinner";

export const LayoutSpinner = (props: SpinnerProps) => (
  <Center flexGrow={1}>
    <Spinner size="xl" {...props} />
  </Center>
);
