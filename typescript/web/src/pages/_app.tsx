import { useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { SessionProvider } from "next-auth/react";

import { AppProps } from "next/app";
import { useRouter } from "next/router";

import { ApolloProvider } from "@apollo/client";

import { CookiesProvider, Cookies } from "react-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { pageView } from "../utils/google-analytics";
import { theme } from "../theme";
import { client } from "../connectors/apollo-client/client";
import { QueryParamProvider } from "../utils/query-params-provider";

import { Meta } from "../components/meta";
import ErrorPage from "./_error";

interface InitialProps {
  cookie: string;
}

const ErrorFallback = (props: FallbackProps) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <CookiesProvider>
        <QueryParamProvider>
          <ApolloProvider client={client}>
            <ErrorPage {...props} />
          </ApolloProvider>
        </QueryParamProvider>
      </CookiesProvider>
    </ChakraProvider>
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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider session={session}>
        <CookiesProvider cookies={new Cookies("")}>
          <ChakraProvider theme={theme} resetCSS>
            <QueryParamProvider>
              <ApolloProvider client={client}>
                <Meta />
                <Component {...pageProps} />
              </ApolloProvider>
            </QueryParamProvider>
          </ChakraProvider>
        </CookiesProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default App;
