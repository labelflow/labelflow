import { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { client } from "../connectors/apollo-client";

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
