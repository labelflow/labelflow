import { ApolloClient, InMemoryCache, HttpLink, concat } from "@apollo/client";
import { awaitServiceWorkerLink } from "./await-service-worker-link";

const httpLink = new HttpLink({ uri: "/api/worker/graphql" });

export const client = new ApolloClient({
  link: concat(awaitServiceWorkerLink, httpLink),
  cache: new InMemoryCache(),
});
