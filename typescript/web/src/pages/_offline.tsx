import { Heading, Text, Center, Box, Button } from "@chakra-ui/react";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { EmptyStateNoConnection } from "../components/empty-state";
import { NavLogo } from "../components/logo/nav-logo";

const OfflinePage = () => {
  return (
    <>
      <Meta title="LabelFlow | Offline" />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <Center h="full">
          <Box as="section">
            <Box
              maxW="2xl"
              mx="auto"
              px={{ base: "6", lg: "8" }}
              py={{ base: "16", sm: "20" }}
              textAlign="center"
            >
              <EmptyStateNoConnection w="full" />
              <Heading as="h2">You are currently offline.</Heading>
              <Text mt="4" fontSize="lg">
                LabelFlow should be usable online, but it looks like it
                isn&apos;t!
              </Text>
              <Button
                colorScheme="brand"
                variant="solid"
                mt="8"
                as="a"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/labelflow/labelflow/issues"
              >
                Report this issue
              </Button>
            </Box>
          </Box>
        </Center>
      </Layout>
    </>
  );
};

export default OfflinePage;
