import { ApolloClient, InMemoryCache, HttpLink, concat } from "@apollo/client";
import { awaitServiceWorkerLink } from "./await-service-worker-link";
import { APOLLO_CACHE_CONFIG } from "./cache-config";

export const serviceWorkerClient = new ApolloClient({
  connectToDevTools: false,
  link: concat(
    awaitServiceWorkerLink,
    new HttpLink({ uri: "/api/worker/graphql", credentials: "same-origin" })
  ),
  cache: new InMemoryCache(APOLLO_CACHE_CONFIG),
});

export const distantDatabaseClient = new ApolloClient({
  connectToDevTools: true,
  link: new HttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(APOLLO_CACHE_CONFIG),
});
