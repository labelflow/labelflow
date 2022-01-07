import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

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
