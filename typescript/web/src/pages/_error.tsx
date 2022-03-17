import { Button, chakra, Code, HStack, Text } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FallbackProps } from "react-error-boundary";
import BrowserLock from "../components/graphics/browser-lock";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { InfoBody } from "../components/info-body/info-body";

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

const ErrorBody = ({
  error,
  resetErrorBoundary,
}: Omit<Props, "statusCode">) => (
  <>
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
  </>
);

const ErrorPage = ({ statusCode, error, resetErrorBoundary }: Props) => {
  const router = useRouter();
  const errorIsNotAuth =
    (error?.message ?? error ?? "").match(/not authenticated/) != null;
  const errorTitle = errorIsNotAuth
    ? "Authentication required"
    : `An error ${statusCode ?? ""} occurred ${statusCode && "on server"}`;

  useEffect(() => {
    const resetErrorBoundaryIfExist = () => {
      if (resetErrorBoundary) resetErrorBoundary();
    };
    // resetErrorBoundary and clear the error reliably
    router.events.on("routeChangeComplete", resetErrorBoundaryIfExist);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", resetErrorBoundaryIfExist);
    };
  }, [router.events, router.reload, resetErrorBoundary]);

  return (
    <>
      <Meta
        title={`LabelFlow | ${
          errorIsNotAuth ? "Authentication required" : "error"
        }`}
      />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <InfoBody
          title={errorTitle}
          illustration={EmptyStateLock}
          homeButtonType={errorIsNotAuth ? "button" : "none"}
          homeButtonLabel="Go back to safety"
        >
          {errorIsNotAuth ? (
            <Text mt="4" fontSize="lg">
              This page is only available to signed-in users. Please sign in to
              access it.
            </Text>
          ) : (
            <ErrorBody error={error} resetErrorBoundary={resetErrorBoundary} />
          )}
        </InfoBody>
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
