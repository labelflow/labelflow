import { ApolloServer } from "apollo-server-micro";
import { schemaWithResolvers, repository } from "@labelflow/db";

const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
  context: { repository },
  introspection: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
await apolloServer.start();

export default apolloServer.createHandler({ path: "/api/graphql" });
