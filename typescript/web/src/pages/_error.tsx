import React from "react";
import {
  Heading,
  Text,
  Code,
  Center,
  Box,
  chakra,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FallbackProps } from "react-error-boundary";
import { NextPageContext } from "next";

import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { EmptyStateError } from "../components/empty-state";
import { NavLogo } from "../components/logo/nav-logo";
import { AuthManager } from "../components/auth-manager";
import BrowserLock from "../components/graphics/browser-lock";
import { SigninButton } from "../components/auth-manager/signin-button";

export const EmptyStateLock = chakra(BrowserLock, {
  baseStyle: {
    width: 250,
    height: 250,
    padding: 6,
    opacity: 1,
    boxSizing: "border-box",
  },
});

type Props = FallbackProps & {
  statusCode?: number;
  error?: Error;
  resetErrorBoundary?: () => void;
};

const ErrorPage = ({ statusCode, error, resetErrorBoundary }: Props) => {
  if ((error?.message ?? error ?? "").match(/not authenticated/) != null) {
    return (
      <>
        <Meta title="LabelFlow | Authentication required" />
        <AuthManager />
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
                <EmptyStateLock w="full" />
                <Heading as="h2">Authentication required</Heading>

                <Text mt="4" fontSize="lg">
                  This page is only available to signed-in users. Please sign in
                  to access it.
                </Text>

                <HStack
                  spacing={4}
                  align="center"
                  justifyContent="center"
                  mt="8"
                  width="full"
                >
                  {/* Not using next/link here in order to resetErrorBoundary and clear the error reliably  */}
                  <Button as="a" href="/">
                    Go back to safety
                  </Button>

                  <SigninButton />
                </HStack>
              </Box>
            </Box>
          </Center>
        </Layout>
      </>
    );
  }
  return (
    <>
      <Meta title="LabelFlow | Error" />
      <AuthManager />
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
              <EmptyStateError w="full" />
              <Heading as="h2">
                {statusCode
                  ? `An error ${statusCode} occurred on server`
                  : "An error occurred"}
              </Heading>

              <Text mt="4" fontSize="lg">
                Please let us know about this issue by reporting it.
                {error && <br />}
                {error && "Here is the error message:"}
              </Text>
              {error && (
                <Code as="p" mt="4">
                  {error?.message ?? error}
                </Code>
              )}
              <HStack
                spacing={4}
                align="center"
                justifyContent="center"
                mt="8"
                width="full"
              >
                {resetErrorBoundary && (
                  <Button onClick={resetErrorBoundary}>Retry</Button>
                )}

                {/* Not using next/link here in order to resetErrorBoundary and clear the error reliably  */}
                <Button as="a" href="/debug">
                  See debug info
                </Button>

                <Button
                  colorScheme="brand"
                  variant="solid"
                  as="a"
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/labelflow/labelflow/issues/new?assignees=&labels=bug&template=bug_report.md&title="
                >
                  Report this issue
                </Button>
              </HStack>
            </Box>
          </Box>
        </Center>
      </Layout>
    </>
  );
};

export const getInitialProps = ({ res, err }: NextPageContext) => {
  // See https://nextjs.org/docs/advanced-features/custom-error-page#more-advanced-error-page-customizing
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, error: null, resetErrorBoundary: null };
};

export default ErrorPage;
