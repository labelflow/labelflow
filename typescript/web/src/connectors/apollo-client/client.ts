import { ApolloClient, InMemoryCache, HttpLink, concat } from "@apollo/client";
import { awaitServiceWorkerLink } from "./await-service-worker-link";

export const serviceWorkerClient = new ApolloClient({
  connectToDevTools: false,
  link: concat(
    awaitServiceWorkerLink,
    new HttpLink({ uri: "/api/worker/graphql", credentials: "same-origin" })
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
      Dataset: {
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

export const distantDatabaseClient = new ApolloClient({
  connectToDevTools: true,
  link: new HttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  }),
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
      Dataset: {
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
