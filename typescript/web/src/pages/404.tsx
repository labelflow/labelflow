import { Heading, Text, Center, Box, Button, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { Meta } from "../components/meta";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";
import { Layout } from "../components/layout";
import { EmptyStateResult } from "../components/empty-state";

const Error404Page = () => {
  return (
    <>
      <Meta title="Labelflow | Page not found" />
      <AppLifecycleManager />

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
              <EmptyStateResult w="full" />
              <Heading as="h2">Page not found</Heading>

              <Text mt="4" fontSize="lg">
                There is nothing to see here.
                <br />
                If you followed a link to get here, you might not have access to
                the content at this page, or the link might be broken.
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
                    cursor="pointer"
                  >
                    Go back to Labelflow home page
                  </Button>
                </NextLink>
              </HStack>
            </Box>
          </Box>
        </Center>
      </Layout>
    </>
  );
};

export default Error404Page;
