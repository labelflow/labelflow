import { Button, Flex, Heading, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

const HomeButton = ({ children }: { children: JSX.Element | string }) => (
  <Button colorScheme="brand" variant="solid" as="a" href="/" cursor="pointer">
    {children}
  </Button>
);

const HomeButtonNextLink = ({
  children,
}: {
  children: JSX.Element | string;
}) => (
  <NextLink href="/">
    <HomeButton>{children}</HomeButton>
  </NextLink>
);

type InfoBodyProps = {
  title: string;
  illustration?: React.ComponentType;
  homeButtonType?: "none" | "button" | "nextLink";
  homeButtonLabel?: string;
  illustrationTitleSpacing?: string | number | undefined;
  children: React.ReactNode;
};

export const InfoBody = ({
  title,
  illustration: Illustration,
  homeButtonType = "none",
  homeButtonLabel = "Go back to LabelFlow home page",
  illustrationTitleSpacing,
  children,
}: InfoBodyProps) => (
  <Flex
    direction="column"
    mx="auto"
    maxW="2xl"
    px={{ base: "6", lg: "8" }}
    py={{ base: "16", sm: "20" }}
    align="center"
    textAlign="center"
  >
    {Illustration && <Illustration />}
    <Heading as="h2" mt={illustrationTitleSpacing}>
      {title}
    </Heading>
    {children}
    <HStack
      spacing={4}
      align="center"
      justifyContent="center"
      mt="8"
      width="full"
    >
      {homeButtonType === "button" && (
        <HomeButton>{homeButtonLabel}</HomeButton>
      )}
      {homeButtonType === "nextLink" && (
        <HomeButtonNextLink>{homeButtonLabel}</HomeButtonNextLink>
      )}
    </HStack>
  </Flex>
);
