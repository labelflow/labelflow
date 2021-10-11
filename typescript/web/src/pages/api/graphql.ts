import { ApolloServer } from "apollo-server-micro";
import { schemaWithResolvers, repository } from "@labelflow/db";
import { getSession } from "next-auth/react";
import { captureException } from "@sentry/nextjs";

const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { repository, session, user: session?.user, req };
  },
  introspection: true,
  formatError: (error) => {
    captureException(error);
    return error;
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
await apolloServer.start();

export default apolloServer.createHandler({ path: "/api/graphql" });
