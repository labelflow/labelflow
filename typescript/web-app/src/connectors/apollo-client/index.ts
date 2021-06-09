import { makeExecutableSchema } from "@graphql-tools/schema";
import { SchemaLink } from "@apollo/client/link/schema";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import typeDefs from "../../../../../data/__generated__/schema.graphql";
import { resolvers } from "./resolvers";
import labelClassDataSource from "./datasources/label-class-dexie";
import labelDataSource from "./datasources/label-dexie";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const client = new ApolloClient({
  link: new SchemaLink({
    schema,
    context: () => {
      return { dataSources: { labelClassDataSource, labelDataSource } };
    },
  }),
  cache: new InMemoryCache(),
});
