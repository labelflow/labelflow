import {
  Box,
  Button,
  Center,
  chakra,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import NextLink from "next/link";
import React from "react";
import { RiArrowLeftLine, RiGlobalLine } from "react-icons/ri";
import { APP_NAME } from "../../constants";
import { useOptionalUser, useOptionalWorkspaces } from "../../hooks";
import { ShopLaptop } from "../graphics";
import { Layout } from "../layout";
import { NavLogo } from "../logo/nav-logo";

const HomeIcon = chakra(RiArrowLeftLine);
const CreateIcon = chakra(RiGlobalLine);

const HomeButton = () => (
  <NextLink href="/">
    <Button
      colorScheme="brand"
      variant="outline"
      as="a"
      href="/"
      cursor="pointer"
      leftIcon={<HomeIcon fontSize="lg" />}
    >
      {APP_NAME} homepage
    </Button>
  </NextLink>
);

const CreateButton = () => {
  const workspaces = useOptionalWorkspaces();
  const message = isEmpty(workspaces)
    ? "Create online workspace"
    : "View online workspaces";
  const user = useOptionalUser();
  const href = isNil(user) ? "/auth/signin" : "/";
  return (
    <NextLink href={href}>
      <Button
        colorScheme="brand"
        variant="solid"
        as="a"
        href={href}
        cursor="pointer"
        leftIcon={<CreateIcon fontSize="lg" />}
      >
        {message}
      </Button>
    </NextLink>
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

const Actions = () => (
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

const ContentSection = () => (
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
      <ShopLaptop w={{ base: "100px", md: "200px" }} />
      <DiscontinuedHeading />
      <ExplanationText />
      <Actions />
    </Flex>
  </Box>
);

export const LocalWorkspaceFallback = () => (
  <Layout breadcrumbs={[<NavLogo key={0} />]}>
    <Center h="full">
      <ContentSection />
    </Center>
  </Layout>
);
