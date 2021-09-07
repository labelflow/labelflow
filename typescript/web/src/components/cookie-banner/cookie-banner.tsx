import { Button, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";

export const CookieBanner = () => (
  <HStack
    justify="center"
    spacing="4"
    p="4"
    bg="gray.700"
    position="fixed"
    bottom="0"
    left="0"
    right="0"
    zIndex="100"
  >
    <Text color="white" fontSize={{ base: "sm", md: "md" }}>
      By using our website, you agree to the use of cookies as described in our{" "}
      <NextLink href="/">
        <Link href="/" textDecoration="underline">
          cookie policy
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
