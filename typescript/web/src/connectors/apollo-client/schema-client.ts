import { makeExecutableSchema } from "@graphql-tools/schema";
import { SchemaLink } from "@apollo/client/link/schema";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { typeDefs } from "./__generated__/schema";
import { resolvers } from "../resolvers";
import { repository } from "../repository";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const client = new ApolloClient({
  link: new SchemaLink({ schema, context: { repository } }),
  cache: new InMemoryCache(),
});
