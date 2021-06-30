import { Heading, Link, Text, Code, Center, Box } from "@chakra-ui/react";

import { Layout } from "../components/layout";

const DebugPage = () => {
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
            <Heading as="h2">Debug information</Heading>

            <Text mt="4" fontSize="lg">
              <Link href="/_next/static/bundle-analyzer/client.html">
                Link to client bundle analysis
              </Link>
            </Text>

            <Text mt="4" fontSize="lg">
              <Link href="/_next/static/bundle-analyzer/server.html">
                Link to server bundle analysis
              </Link>
            </Text>

            <Text mt="4" fontSize="lg">
              Environment:
            </Text>

            <Code as="p" mt="4">
              {JSON.stringify(process.env, null, 2)}
            </Code>
          </Box>
        </Box>
      </Center>
    </Layout>
  );
};

export default DebugPage;
