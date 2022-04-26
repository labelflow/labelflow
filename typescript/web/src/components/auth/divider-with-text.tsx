import { Divider, HStack, StackProps, Text } from "@chakra-ui/react";
import * as React from "react";

export const DividerWithText = ({ children, ...props }: StackProps) => (
  <HStack my="8" {...props}>
    <Divider />
    <Text
      px="3"
      fontSize="sm"
      fontWeight="semibold"
      color="gray.400"
      minW="fit-content"
    >
      {children}
    </Text>
    <Divider />
  </HStack>
);
