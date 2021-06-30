import {
  Heading,
  Link,
  VStack,
  Text,
  Code,
  Center,
  Box,
} from "@chakra-ui/react";

import { Layout } from "../components/layout";

const DebugPage = () => {
  return (
    <Layout>
      <Center h="full">
        <Box as="section">
          <VStack
            maxW="2xl"
            mx="auto"
            px={{ base: "6", lg: "8" }}
            py={{ base: "16", sm: "20" }}
            textAlign="center"
            spacing="0"
          >
            <Heading as="h2">Debug information</Heading>

            <Heading as="h3" pt="8" pb="4" fontSize="lg">
              Links:
            </Heading>

            <Text fontSize="lg">
              <Link href="/_next/static/bundle-analyzer/client.html">
                Link to client bundle analysis
              </Link>
              <br />
              <Link href="/_next/static/bundle-analyzer/server.html">
                Link to server bundle analysis
              </Link>
              <br />
              <Link
                href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/tree/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}`}
              >
                Link to Github branch
              </Link>
              <br />
              <Link
                href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
              >
                Link to Github commit
              </Link>
              <br />
              <Link href={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}>
                Link to Vercel deployment
              </Link>
            </Text>

            <Heading as="h3" pt="8" pb="4" fontSize="lg">
              Environment:
            </Heading>

            <Code as="p">
              NEXT_PUBLIC_VERCEL_ENV: {process.env.NEXT_PUBLIC_VERCEL_ENV}{" "}
              <br />
              NEXT_PUBLIC_VERCEL_URL: {process.env.NEXT_PUBLIC_VERCEL_URL}{" "}
              <br />
              NEXT_PUBLIC_VERCEL_GIT_PROVIDER:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER} <br />
              NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG} <br />
              NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER} <br />
              NEXT_PUBLIC_VERCEL_GIT_REPO_ID:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_ID} <br />
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF} <br />
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA} <br />
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE} <br />
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN} <br />
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}
            </Code>
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
};

export default DebugPage;
