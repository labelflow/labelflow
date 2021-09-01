import { Text, TextProps } from "@chakra-ui/react";
import * as React from "react";

export const Copyright = (props: TextProps) => (
  <Text fontSize="sm" {...props}>
    &copy; {new Date().getFullYear()} LabelFlow, All rights reserved.
  </Text>
);
