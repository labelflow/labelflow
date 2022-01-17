import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Center,
  Code,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { detect } from "detect-browser";
import NextLink from "next/link";
import React from "react";
import { Authenticated } from "../components/auth";
import { CookieBanner } from "../components/cookie-banner";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import {
  isDevelopmentEnvironment,
  isInWindowScope,
} from "../utils/detect-scope";

export const DEBUG_QUERY = gql`
  query GetDebugQuery {
    debug
  }
`;

const DebugPage = () => {
  const { data: debugResult } = useQuery<{ debug: any }>(DEBUG_QUERY);

  return (
    <Authenticated>
      <Meta title="LabelFlow | Debug" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />, <Text key={1}>Debug</Text>]}>
        <Center h="full">
          <Box as="section">
            <VStack
              maxW="2xl"
              mx="auto"
              px={{ base: "6", lg: "8" }}
              py={{ base: "16", sm: "20" }}
              textAlign="start"
              spacing="0"
              alignItems="start"
            >
              <Heading as="h2">Debug information</Heading>

              <Heading as="h3" pt="8" pb="4" fontSize="lg">
                Links:
              </Heading>

              <UnorderedList fontSize="lg" pl="8">
                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/issues/new/choose`}
                  >
                    Link to Github issue tracker
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://sentry.io/organizations/labelflow/projects/labelflow/"
                  >
                    Link to Sentry error tracker
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://clarity.microsoft.com/projects/view/${process.env.NEXT_PUBLIC_CLARITY}/dashboard`}
                  >
                    Link to Clarity usage analytics
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="/_next/static/bundle-analyzer/client.html"
                  >
                    Link to client bundle analysis
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="/_next/static/bundle-analyzer/server.html"
                  >
                    Link to server bundle analysis
                  </Link>
                </ListItem>

                <ListItem>
                  <NextLink href="/graphiql">
                    <Link href="/graphiql">Link to Graphiql</Link>
                  </NextLink>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://app.supabase.io/project/zokyprbhquvvrleedkkk/editor/table"
                  >
                    Link to Database admin
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://strapi.labelflow.ai/admin"
                  >
                    Link to CMS admin
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/tree/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}`}
                  >
                    Link to Github branch
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                  >
                    Link to Github commit
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}
                  >
                    Link to Vercel deployment
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://dashboard.heroku.com/apps/labelflow-strapi"
                  >
                    Link to CMS deployment on Heroku
                  </Link>
                </ListItem>

                <ListItem>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://app.sendgrid.com/"
                  >
                    Link to mailer provider
                  </Link>
                </ListItem>
              </UnorderedList>

              <Heading as="h3" pt="8" pb="4" fontSize="lg">
                Client environment:
              </Heading>

              <Code as="p" whiteSpace="pre-wrap" width="full">
                {JSON.stringify(
                  {
                    clientType: "Standard LabelFlow Client App",
                    isInWindowScope,
                    isDevelopmentEnvironment,
                    browser: { ...detect() },
                    env: {
                      ...process.env,
                      // We have to explicitly write `process.env.XXX`, we can't map over `process.env`
                      NODE_ENV: process.env.NODE_ENV,
                      NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
                      NEXT_PUBLIC_VERCEL_ENV:
                        process.env.NEXT_PUBLIC_VERCEL_ENV,
                      NEXT_PUBLIC_VERCEL_URL:
                        process.env.NEXT_PUBLIC_VERCEL_URL,
                      NEXT_PUBLIC_VERCEL_GIT_PROVIDER:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER,
                      NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG,
                      NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER,
                      NEXT_PUBLIC_VERCEL_GIT_REPO_ID:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_ID,
                      NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF,
                      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
                      NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE,
                      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
                      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME:
                        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME,
                      NEXT_PUBLIC_IOG_API_ENDPOINT:
                        process.env.NEXT_PUBLIC_IOG_API_ENDPOINT,
                    },
                  },
                  null,
                  2
                )}
              </Code>

              <Heading as="h3" pt="8" pb="4" fontSize="lg">
                Server environment:
              </Heading>

              <Code as="p" whiteSpace="pre-wrap" width="full">
                {JSON.stringify(debugResult?.debug, null, 2)}
              </Code>
            </VStack>
          </Box>
        </Center>
      </Layout>
    </Authenticated>
  );
};

export default DebugPage;
