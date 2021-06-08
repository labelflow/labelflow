import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "/worker/graphql",
  cache: new InMemoryCache(),
});
