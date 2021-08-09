import { useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { AppProps, AppContext } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { useCookie } from "next-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../theme";
import { client } from "../connectors/apollo-client/client";
import { QueryParamProvider } from "../utils/query-params-provider";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";
import { isInWindowScope } from "../utils/detect-scope";
import { Meta } from "../components/meta";
import ErrorPage from "./_error";

interface InitialProps {
  assumeServiceWorkerActive: boolean;
  cookie: string;
}

const ErrorFallback = (props: FallbackProps) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <QueryParamProvider>
        <ApolloProvider client={client}>
          <ErrorPage {...props} />
        </ApolloProvider>
      </QueryParamProvider>
    </ChakraProvider>
  );
};

const App = (props: AppProps & InitialProps) => {
  const {
    Component,
    pageProps,
    cookie,
    assumeServiceWorkerActive: assumeServiceWorkerActiveFromServer,
  } = props;

  const parsedCookie = useCookie(cookie);

  useEffect(() => {
    const assumeServiceWorkerActiveFromClient = parsedCookie?.get<boolean>(
      "assumeServiceWorkerActive"
    );
    if (!assumeServiceWorkerActiveFromServer) {
      if (!assumeServiceWorkerActiveFromClient && isInWindowScope) {
        console.warn(
          "Set the cookie client side in browser because it was not set with server http response. This should not happen"
        );
        parsedCookie?.set("assumeServiceWorkerActive", true, {
          path: "/",
          httpOnly: false,
          maxAge: 315569260000, // 10years
          expires: new Date(Date.now() + 315569260000),
          sameSite: "strict",
        });
      }
    }
  }, [parsedCookie, assumeServiceWorkerActiveFromServer]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ChakraProvider theme={theme} resetCSS>
        <QueryParamProvider>
          <ApolloProvider client={client}>
            <Meta />
            <AppLifecycleManager
              assumeServiceWorkerActive={assumeServiceWorkerActiveFromServer}
            />
            <Component {...pageProps} />
          </ApolloProvider>
        </QueryParamProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
};

App.getInitialProps = async (context: AppContext): Promise<InitialProps> => {
  const { ctx } = context;
  const parsedCookie = useCookie(ctx);

  const assumeServiceWorkerActive = parsedCookie.get<boolean>(
    "assumeServiceWorkerActive"
  );

  // Set the cookie via http response
  parsedCookie?.set("assumeServiceWorkerActive", true, {
    path: "/",
    httpOnly: false,
    maxAge: 315569260000, // 10years
    expires: new Date(Date.now() + 315569260000),
    sameSite: "strict",
  });

  return {
    assumeServiceWorkerActive: assumeServiceWorkerActive ?? false,
    cookie: ctx?.req?.headers?.cookie ?? "",
  };
};

export default App;
