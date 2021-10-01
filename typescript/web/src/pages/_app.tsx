import { useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import { ApolloProvider } from "@apollo/client";

import { CookiesProvider, Cookies } from "react-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { pageView } from "../utils/google-analytics";
import { theme } from "../theme";
import {
  serviceWorkerClient,
  distantDatabaseClient,
} from "../connectors/apollo-client/client";
import { QueryParamProvider } from "../utils/query-params-provider";
import ErrorPage from "./_error";

interface InitialProps {
  cookie: string;
}

const ErrorFallback = (props: FallbackProps) => {
  return (
    <SessionProvider session={undefined}>
      <QueryParamProvider>
        <ChakraProvider theme={theme} resetCSS>
          <ErrorPage {...props} />
        </ChakraProvider>
      </QueryParamProvider>
    </SessionProvider>
  );
};

const App = (props: AppProps & InitialProps) => {
  const { Component, pageProps } = props;
  const { session } = pageProps;

  // Google analytics
  // See https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/
  const router = useRouter();

  const client = globalThis?.location?.pathname?.startsWith("/local")
    ? serviceWorkerClient
    : distantDatabaseClient;

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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider session={session}>
        <CookiesProvider cookies={new Cookies("")}>
          <ApolloProvider client={client}>
            <QueryParamProvider>
              <ChakraProvider theme={theme} resetCSS>
                <Head>
                  {/* Set proper initial appearance of content for mobile */}
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                </Head>
                <Component {...pageProps} />
              </ChakraProvider>
            </QueryParamProvider>
          </ApolloProvider>
        </CookiesProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default App;
