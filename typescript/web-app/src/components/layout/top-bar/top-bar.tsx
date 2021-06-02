import { ReactNode } from "react";
import { HStack, Spacer } from "@chakra-ui/react";
import { Logo } from "../../logo";
import { ImportButton } from "./import-button";
import { KeymapButton } from "./keymap-button";

export type Props = {
  leftContent?: ReactNode;
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
      <Spacer />
      <KeymapButton />
      <ImportButton />
    </HStack>
  );
};
