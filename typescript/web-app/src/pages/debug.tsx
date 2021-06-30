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
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_ACTION: {
                process.env.NEXT_PUBLIC_GITHUB_ACTION
              }{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_ACTION_PATH:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_ACTION_PATH} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_ACTOR: {
                process.env.NEXT_PUBLIC_GITHUB_ACTOR
              }{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_BASE_REF:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_BASE_REF} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_EVENT: {
                process.env.NEXT_PUBLIC_GITHUB_EVENT
              }{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_EVENT_NAME:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_EVENT_NAME} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_EVENT_PATH:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_EVENT_PATH} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_HEAD_REF:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_HEAD_REF} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_JOB: {process.env.NEXT_PUBLIC_GITHUB_JOB}{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_REF: {process.env.NEXT_PUBLIC_GITHUB_REF}{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_REPOSITORY:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_REPOSITORY} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_REPOSITORY_OWNER:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_OWNER} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_RUN_ID: {
                process.env.NEXT_PUBLIC_GITHUB_RUN_ID
              }{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_RUN_NUMBER:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_RUN_NUMBER} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_SHA: {process.env.NEXT_PUBLIC_GITHUB_SHA}{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_WORKFLOW:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_WORKFLOW} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_GITHUB_WORKSPACE:{" "}
              {process.env.NEXT_PUBLIC_GITHUB_WORKSPACE} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_ENV_JSON: {process.env.NEXT_PUBLIC_ENV_JSON} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_ENV: {process.env.NEXT_PUBLIC_VERCEL_ENV}{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_URL: {process.env.NEXT_PUBLIC_VERCEL_URL}{" "}
              <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_PROVIDER:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_REPO_ID:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_ID} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN} <br />
              {/* eslint-disable-next-line prettier/prettier */}
              NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME:{" "}
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}
            </Code>
          </Box>
        </Box>
      </Center>
    </Layout>
  );
};

export default DebugPage;
