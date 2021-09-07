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
import { useRouter } from "next/router";
import NextLink from "next/link";

import { RiArrowGoBackLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Logo } from "../../logo";
import { HelpMenu } from "./help-menu";
import { UserMenu } from "./user-menu";
import { SigninButton } from "../../auth-manager/signin-button";

export type Props = {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
};

const BackIcon = chakra(RiArrowGoBackLine);

export const TopBar = ({ leftContent, rightContent }: Props) => {
  const { status } = useSession({ required: false });

  const router = useRouter();
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
      <Box flex={1} width="auto" display={{ base: "none", lg: "contents" }}>
        {leftContent}
      </Box>

      <NextLink
        href={{
          pathname: router.pathname.replace(/\/[^/]+$/, ""),
          query: router.query,
        }}
      >
        <Tooltip label="Go Back" openDelay={300}>
          <IconButton
            as="a"
            href=".."
            display={{ base: "flex", lg: "none" }}
            aria-label="Go Back"
            icon={<BackIcon fontSize="xl" />}
            variant="ghost"
          />
        </Tooltip>
      </NextLink>

      <Spacer />
      {rightContent}
      <HelpMenu />
      {process.env.NEXT_PUBLIC_FEATURE_SIGNIN === "true" &&
        status === "unauthenticated" && <SigninButton />}
      <UserMenu />
    </HStack>
  );
};
