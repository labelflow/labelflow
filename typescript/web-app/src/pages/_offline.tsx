import { Heading, Text, Center, Box, Button } from "@chakra-ui/react";
import { Layout } from "../components/layout";

import { EmptyStateInternetConnection } from "../components/empty-state";

const OfflinePage = () => {
  return (
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
            <EmptyStateInternetConnection w="full" />
            <Heading as="h2">You are currently offline.</Heading>
            <Text mt="4" fontSize="lg">
              Labelflow should be usable online, but it looks like it
              isn&apos;t!
            </Text>
            <Button
              colorScheme="brand"
              variant="solid"
              mt="8"
              as="a"
              href="https://github.com/Labelflow/labelflow/issues"
            >
              Report this issue
            </Button>
          </Box>
        </Box>
      </Center>
    </Layout>
  );
};

export default OfflinePage;
