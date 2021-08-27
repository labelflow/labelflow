import { ApolloProvider } from "@apollo/client";

import { client } from "../connectors/apollo-client/schema-client";

export const apolloDecorator = (Story: any) => (
  <ApolloProvider client={client}>
    <Story />
  </ApolloProvider>
);
