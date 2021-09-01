import { ReactNode } from "react";
import {
  HStack,
  Spacer,
  Box,
  VisuallyHidden,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Logo } from "../../logo";
import { HelpMenu } from "./help-menu";
import { UserMenu } from "./user-menu";

export type Props = {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
};

export const TopBar = ({ leftContent, rightContent }: Props) => {
  const viewBox = useBreakpointValue({ base: "0 0 84 84", md: "0 0 393 84" });
  return (
    <HStack
      as="header"
      alignItems="center"
      padding={4}
      spacing={4}
      h="64px"
      flex={0}
    >
      <NextLink href="/">
        <Box as="a" rel="home" cursor="pointer">
          <VisuallyHidden>Labelflow</VisuallyHidden>
          <Logo h="6" iconColor="brand.500" viewBox={viewBox} />
        </Box>
      </NextLink>
      {/* {leftContent} */}
      <Spacer />
      {rightContent}
      <HelpMenu />
      <UserMenu />
    </HStack>
  );
};
