import { useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import { ApolloProvider } from "@apollo/client";

import { CookiesProvider, Cookies } from "react-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { pageView } from "../utils/google-analytics";
import { theme } from "../theme";
import { distantDatabaseClient } from "../connectors/apollo-client/client";
import { QueryParamProvider } from "../utils/query-params-provider";
import ErrorPage from "./_error";
import { MockableLocationProvider } from "../utils/mockable-location";

interface InitialProps {
  cookie: string;
  fullHeight?: boolean;
}

/**
 * Error Fallback page of the Error Fallback page , for rare cases (only happens in cypress on certain crashes) where even the styling or other context can't work
 * @returns
 */
const ErrorFallbackErrorFallback = () => {
  return (
    <div>
      An error occurred when displaying the error page, you can&apos;t really
      get any worse than that. Please{" "}
      <a
        style={{ color: "blue", textDecoration: "underline" }}
        href="https://github.com/labelflow/labelflow/issues/new?assignees=&labels=bug&template=bug_report.md&title="
      >
        report this issue
      </a>
      .
    </div>
  );
};

/**
 * Error Fallback page
 * @returns
 */
const ErrorFallback = (props: FallbackProps) => {
  const { data: session } = useSession();
  return (
    <SessionProvider session={session}>
      <CookiesProvider cookies={new Cookies("")}>
        <ApolloProvider client={distantDatabaseClient}>
          <QueryParamProvider>
            <ChakraProvider theme={theme} resetCSS>
              <ErrorPage {...props} />
            </ChakraProvider>
          </QueryParamProvider>
        </ApolloProvider>
      </CookiesProvider>
    </SessionProvider>
  );
};

const App = (props: AppProps & InitialProps) => {
  const { Component, pageProps } = props;
  const { session } = pageProps;

  // Google analytics
  // See https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageView(url);
    };
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackErrorFallback}>
      <SessionProvider session={session}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <CookiesProvider cookies={new Cookies("")}>
            <ApolloProvider client={distantDatabaseClient}>
              <QueryParamProvider>
                <ChakraProvider theme={theme} resetCSS>
                  <MockableLocationProvider>
                    <Head>
                      {/* Set proper initial appearance of content for mobile */}
                      <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                      />
                    </Head>
                    <Component {...pageProps} />
                  </MockableLocationProvider>
                </ChakraProvider>
              </QueryParamProvider>
            </ApolloProvider>
          </CookiesProvider>
        </ErrorBoundary>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default App;
