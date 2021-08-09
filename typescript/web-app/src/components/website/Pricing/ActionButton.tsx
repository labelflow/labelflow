import { Button, ButtonProps } from "@chakra-ui/react";
import * as React from "react";

export const ActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button
      colorScheme="brand"
      size="lg"
      w="full"
      fontWeight="extrabold"
      py={{ md: "8" }}
      {...props}
      ref={ref}
    />
  )
);
