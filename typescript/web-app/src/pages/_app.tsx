import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../theme";
import { client } from "../connectors/apollo-client-service-worker";
import { QueryParamProvider } from "../utils/query-params-provider";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryParamProvider>
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme} resetCSS>
          <AppLifecycleManager />
          <Component {...pageProps} />
        </ChakraProvider>
      </ApolloProvider>
    </QueryParamProvider>
  );
}

export default App;
