import { ApolloClient, InMemoryCache, HttpLink, concat } from "@apollo/client";
import { awaitServiceWorkerLink } from "./await-service-worker-link";

export const client = new ApolloClient({
  link: process.env.NEXT_PUBLIC_ENDPOINT
    ? // Remote endpoint set: use this remote endpoint
      new HttpLink({ uri: process.env.NEXT_PUBLIC_ENDPOINT })
    : // No remote endpoint set: use local service worker
      concat(
        awaitServiceWorkerLink,
        new HttpLink({ uri: "/api/worker/graphql" })
      ),
  cache: new InMemoryCache({
    typePolicies: {
      Label: {
        fields: {
          geometry: {
            // Short for options.mergeObjects(existing, incoming), see https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
            merge: true,
          },
        },
      },
    },
  }),
});
