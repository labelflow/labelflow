import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:3000/worker/graphql",
  cache: new InMemoryCache(),
});
