import {
  Divider,
  HStack,
  StackProps,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";

export const DividerWithText = ({ children, ...props }: StackProps) => (
  <HStack my="8" {...props}>
    <Divider />
    <Text
      px="3"
      fontSize="sm"
      fontWeight="semibold"
      color={mode("gray.600", "gray.200")}
      minW="fit-content"
    >
      {children}
    </Text>
    <Divider />
  </HStack>
);
