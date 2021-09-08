import React from "react";
import { Heading, Text, Center, Box, Button, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { Meta } from "../components/meta";

import { Layout } from "../components/layout";
import { EmptyStateNoSearchResult } from "../components/empty-state";
import { ServiceWorkerManagerModal } from "../components/service-worker-manager";
import { WelcomeManager } from "../components/welcome-manager";
import { AuthManager } from "../components/auth-manager";
import { CookieBanner } from "../components/cookie-banner";

export const Error404Content = () => (
  <Layout>
    <Center h="full">
      <Box as="section">
        <Box
          maxW="2xl"
          mx="auto"
          px={{ base: "6", lg: "8" }}
          py={{ base: "16", sm: "20" }}
          textAlign="center"
        >
          <EmptyStateNoSearchResult w="full" />
          <Heading as="h2">Page not found</Heading>

          <Text mt="4" fontSize="lg">
            There is nothing to see here.
            <br />
            If you followed a link to get here, you might not have access to the
            content at this page, or the link might be broken.
          </Text>

          <HStack
            spacing={4}
            align="center"
            justifyContent="center"
            mt="8"
            width="full"
          >
            <NextLink href="/">
              <Button
                colorScheme="brand"
                variant="solid"
                as="a"
                href="/"
                cursor="pointer"
              >
                Go back to LabelFlow home page
              </Button>
            </NextLink>
          </HStack>
        </Box>
      </Box>
    </Center>
  </Layout>
);

const Error404Page = () => {
  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Not found" />
      <CookieBanner />
      <Error404Content />
    </>
  );
};

export default Error404Page;
