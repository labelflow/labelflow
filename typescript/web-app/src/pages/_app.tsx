import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { AppProps, AppContext } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { useCookie } from "next-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../theme";
import { client } from "../connectors/apollo-client-service-worker";
import { QueryParamProvider } from "../utils/query-params-provider";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";
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
  const assumeServiceWorkerActiveFromClient = parsedCookie?.get<boolean>(
    "assumeServiceWorkerActive"
  );

  if (!assumeServiceWorkerActiveFromServer) {
    console.log("This is your first visit");
    if (!assumeServiceWorkerActiveFromClient) {
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

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log("reset app");
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <ChakraProvider theme={theme} resetCSS>
        <QueryParamProvider>
          <ApolloProvider client={client}>
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
  console.warn("Set the cookie server side in http response");
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
