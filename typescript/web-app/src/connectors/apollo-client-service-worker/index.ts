import { ApolloClient, InMemoryCache, HttpLink, concat } from "@apollo/client";
import { awaitServiceWorkerLink } from "./await-service-worker-link";

const httpLink = new HttpLink({ uri: "/api/worker/graphql" });

export const client = new ApolloClient({
  link: concat(awaitServiceWorkerLink, httpLink),
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
      Project: {
        fields: {
          labelClasses: {
            // Short for keeping only the incoming data, see https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
            merge: false,
          },
        },
      },
    },
  }),
});
