import { ApolloServer } from "./apollo-server-service-worker";
import typeDefs from "../../../../data/__generated__/schema.graphql";
import { resolvers } from "../connectors/resolvers";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});
