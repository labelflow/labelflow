import { ReactNode } from "react";
import {
  HStack,
  Spacer,
  chakra,
  Box,
  VisuallyHidden,
  Text,
  Tooltip,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Session } from "next-auth";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useSession } from "next-auth/client";
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
  const [session, loading] = useSession();
  console.log("useSession()", useSession());
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
      <Tooltip label="Go Back" openDelay={300}>
        <NextLink
          href={{
            pathname: router.pathname.replace(/\/[^/]+$/, ""),
            query: router.query,
          }}
        >
          <IconButton
            as="a"
            href=".."
            display={{ base: "flex", lg: "none" }}
            aria-label="Go Back"
            icon={<BackIcon fontSize="xl" />}
            variant="ghost"
          />
        </NextLink>
      </Tooltip>
      <Spacer />
      {rightContent}
      <HelpMenu />
      {loading ? (
        <Text>Loading</Text>
      ) : session ? (
        <Text>{`Signed in as ${(session! as Session)?.user?.email}`}</Text>
      ) : (
        <SigninButton />
      )}
      <UserMenu />
    </HStack>
  );
};
