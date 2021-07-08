import {
  Heading,
  Text,
  Code,
  Center,
  Box,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FallbackProps } from "react-error-boundary";
import { NextPageContext } from "next";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { EmptyStateOops } from "../components/empty-state";

type Props = FallbackProps & {
  statusCode?: number;
  error?: Error;
  resetErrorBoundary?: () => void;
};

const ErrorPage = ({ statusCode, error, resetErrorBoundary }: Props) => {
  return (
    <>
      <Meta title="Labelflow | Error" />
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
              <EmptyStateOops w="full" />
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

                <Button as="a" target="_blank" rel="noreferrer" href="/debug">
                  See debug info
                </Button>

                <Button
                  colorScheme="brand"
                  variant="solid"
                  as="a"
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/Labelflow/labelflow/issues"
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

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  // See https://nextjs.org/docs/advanced-features/custom-error-page#more-advanced-error-page-customizing
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, error: null, resetErrorBoundary: null };
};

export default ErrorPage;
