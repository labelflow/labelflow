import { ApolloProvider } from "@apollo/client";

import { client } from "../connectors/apollo-client/schema-client";

export const apolloDecorator = (storyFn: any) => (
  <ApolloProvider client={client}>{storyFn()}</ApolloProvider>
);
