import { ApolloProvider } from "@apollo/client";

import { client } from "../connectors/apollo-client";

export const apolloDecorator = (storyFn: any) => (
  <ApolloProvider client={client}>{storyFn()}</ApolloProvider>
);
