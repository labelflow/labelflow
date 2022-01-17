import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { APOLLO_CACHE_CONFIG } from "./cache-config";

export const distantDatabaseClient = new ApolloClient({
  connectToDevTools: true,
  link: new HttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(APOLLO_CACHE_CONFIG),
});
