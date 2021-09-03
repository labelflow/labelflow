import { ApolloServer } from "apollo-server-micro";
import { schemaWithResolvers, repository } from "@labelflow/db";
import { getSession } from "next-auth/client";

const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { repository, session, user: session?.user };
  },
  introspection: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
await apolloServer.start();

export default apolloServer.createHandler({ path: "/api/graphql" });
