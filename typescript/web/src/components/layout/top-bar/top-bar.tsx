import { ReactNode } from "react";
import {
  HStack,
  Spacer,
  chakra,
  Box,
  VisuallyHidden,
  Tooltip,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";

import NextLink from "next/link";

import { useSession } from "next-auth/react";

import { Logo } from "../../logo";
import { SigninButton } from "../../auth-manager/signin-button";

import { HelpMenu } from "./help-menu";
import { UserMenu } from "./user-menu";
import { ResponsiveBreadcrumbs } from "./breadcrumbs";

export type Props = {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
};

export const TopBar = ({ leftContent, rightContent }: Props) => {
  const { status } = useSession({ required: false });

  const viewBox =
    useBreakpointValue({ base: "0 0 84 84", md: "0 0 393 84" }) ?? "0 0 84 84";

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
        <Box as="a" rel="home" cursor="pointer" mr={{ base: "0", lg: "4" }}>
          <VisuallyHidden>LabelFlow</VisuallyHidden>
          <Logo h="6" iconColor="brand.500" viewBox={viewBox} />
        </Box>
      </NextLink>
      <ResponsiveBreadcrumbs>{leftContent}</ResponsiveBreadcrumbs>
      <Spacer minWidth="6" />
      {rightContent}
      <HelpMenu />
      {process.env.NEXT_PUBLIC_FEATURE_SIGNIN === "true" &&
        status === "unauthenticated" && <SigninButton />}
      <UserMenu />
    </HStack>
  );
};
