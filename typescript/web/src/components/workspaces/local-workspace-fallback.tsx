import {
  Box,
  Button,
  ButtonProps,
  Center,
  chakra,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import NextLink from "next/link";
import { createContext, PropsWithChildren, useContext } from "react";
import { IconType } from "react-icons/lib";
import { RiArrowLeftLine, RiGlobalLine } from "react-icons/ri";
import { APP_NAME } from "../../constants";
import { useOptionalUser, useOptionalWorkspaces } from "../../hooks";
import { ShopLaptop } from "../graphics";
import { Layout } from "../layout";
import { NavLogo } from "../logo/nav-logo";

type LocalWorkspaceFallbackState = {
  hasWorkspaces: boolean;
  homeUrl: string;
  workspacesUrl: string;
};

const LocalWorkspaceFallbackContext = createContext(
  {} as LocalWorkspaceFallbackState
);

const useLocalWorkspaceFallback = () =>
  useContext(LocalWorkspaceFallbackContext);

const useLocalWorkspaceFallbackProvider = (): LocalWorkspaceFallbackState => {
  const user = useOptionalUser();
  const connected = !isNil(user);
  const workspaces = useOptionalWorkspaces();
  const hasWorkspaces = !isEmpty(workspaces);
  const homeUrl = connected && hasWorkspaces ? "/workspaces" : "/";
  const workspacesUrl = connected ? "/workspaces" : "/auth/signin";
  return { hasWorkspaces, homeUrl, workspacesUrl };
};

const LocalWorkspaceFallbackProvider = ({
  children,
}: PropsWithChildren<{}>) => (
  <LocalWorkspaceFallbackContext.Provider
    value={useLocalWorkspaceFallbackProvider()}
  >
    {children}
  </LocalWorkspaceFallbackContext.Provider>
);

type ActionButtonProps = PropsWithChildren<{
  href: string;
  icon: IconType;
  variant: ButtonProps["variant"];
}>;

const LinkButton = ({ href, variant, icon, children }: ActionButtonProps) => {
  const Icon = chakra(icon);
  return (
    <NextLink href={href}>
      <Button
        colorScheme="brand"
        variant={variant}
        as="a"
        href={href}
        cursor="pointer"
        leftIcon={<Icon fontSize="lg" />}
      >
        {children}
      </Button>
    </NextLink>
  );
};

const HomeButton = () => {
  const { homeUrl } = useLocalWorkspaceFallback();
  return (
    <LinkButton href={homeUrl} variant="outline" icon={RiArrowLeftLine}>
      {APP_NAME} homepage
    </LinkButton>
  );
};

const CreateButton = () => {
  const { workspacesUrl, hasWorkspaces } = useLocalWorkspaceFallback();
  return (
    <LinkButton href={workspacesUrl} variant="solid" icon={RiGlobalLine}>
      {hasWorkspaces ? "View online workspaces" : "Create online workspace"}
    </LinkButton>
  );
};

const DiscontinuedHeading = () => (
  <Heading as="h2" mt={8}>
    Local workspace is discontinued
  </Heading>
);

const ExplanationText = () => (
  <Text mt={2}>
    Instead, you can create an online workspace for free and collaborate with
    your team
  </Text>
);

const Actions = () => {
  return (
    <Stack
      mt={8}
      spacing="4"
      justifyContent={{ md: "center" }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <HomeButton />
      <CreateButton />
    </Stack>
  );
};

const ContentBody = () => (
  <>
    <ShopLaptop w={{ base: "100px", md: "200px" }} />
    <DiscontinuedHeading />
    <ExplanationText />
    <Actions />
  </>
);

const ContentLayout = ({ children }: PropsWithChildren<{}>) => (
  <Box as="section">
    <Flex
      direction="column"
      maxW="4xl"
      mx="auto"
      px={{ base: "6", lg: "8" }}
      py={{ base: "16", sm: "20" }}
      textAlign="center"
      align="center"
    >
      {children}
    </Flex>
  </Box>
);

const LayoutBody = () => (
  <Center h="full">
    <ContentLayout>
      <ContentBody />
    </ContentLayout>
  </Center>
);

const Body = () => {
  const { homeUrl } = useLocalWorkspaceFallback();
  return (
    <Layout breadcrumbs={[<NavLogo key={0} href={homeUrl} />]}>
      <LayoutBody />
    </Layout>
  );
};

export const LocalWorkspaceFallback = () => (
  <LocalWorkspaceFallbackProvider>
    <Body />
  </LocalWorkspaceFallbackProvider>
);
