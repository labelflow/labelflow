import * as React from "react";
import { HStack } from "@chakra-ui/react";
import { Logo } from "../logo";

export type Props = {
  leftContent?: React.ReactNode;
};

export const TopBar = ({ leftContent }: Props) => {
  return (
    <HStack
      as="header"
      alignItems="center"
      bg="white"
      padding={4}
      spacing={4}
      h="64px"
      flex={0}
    >
      <Logo h="26px" />
      {leftContent}
    </HStack>
  );
};
