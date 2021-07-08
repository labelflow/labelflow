import { ReactNode } from "react";
import { HStack, Spacer, Box, VisuallyHidden } from "@chakra-ui/react";
import NextLink from "next/link";
import { Logo } from "../../logo";
import { ImportButton } from "../../import-button";
import { ExportButton } from "../../export-button";
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
      <NextLink href="/">
        <Box as="a" rel="home" cursor="pointer">
          <VisuallyHidden>Labelflow</VisuallyHidden>
          <Logo h="6" iconColor="brand.500" />
        </Box>
      </NextLink>
      {leftContent}
      <Spacer />
      <KeymapButton />
      <ImportButton />
      <ExportButton />
    </HStack>
  );
};
