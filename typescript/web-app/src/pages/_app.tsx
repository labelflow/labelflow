import { NextPage, NextPageContext } from "next";
import { AppProps, AppContext, Container } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { useCookie } from "next-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../theme";
import { client } from "../connectors/apollo-client-service-worker";
import { QueryParamProvider } from "../utils/query-params-provider";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";

interface InitialProps {
  assumeServiceWorkerActive: boolean;
  cookie: string;
}

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
    if (!assumeServiceWorkerActiveFromClient) {
      console.warn(
        "Set the cookie programmatically in JS because it was not set with server http response. This should not happen"
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
    <QueryParamProvider>
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme} resetCSS>
          <AppLifecycleManager
            assumeServiceWorkerActive={assumeServiceWorkerActiveFromServer}
          />
          <Component {...pageProps} />
        </ChakraProvider>
      </ApolloProvider>
    </QueryParamProvider>
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
