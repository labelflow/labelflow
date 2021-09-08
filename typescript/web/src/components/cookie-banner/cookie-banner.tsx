import { Button, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";

export const CookieBanner = () => (
  <HStack
    justify="center"
    spacing="4"
    p="4"
    bg="brand.600"
    position="fixed"
    bottom="0"
    left="0"
    right="0"
    zIndex="100"
  >
    <Text color="white" fontSize={{ base: "sm", md: "md" }}>
      Like every organization on earth we use cookies. We use cookies to analyze
      our product usage. We don't use cookies for commercial purposes.{" "}
      <NextLink href="/">
        <Link href="/" textDecoration="underline">
          Learn More
        </Link>
      </NextLink>
    </Text>
    <Button
      bg="white"
      color="black"
      _hover={{ bg: "gray.100" }}
      size="sm"
      flexShrink={0}
    >
      Accept
    </Button>
  </HStack>
);
