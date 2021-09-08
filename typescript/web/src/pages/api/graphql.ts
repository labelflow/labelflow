import { ApolloServer, AuthenticationError } from "apollo-server-micro";
import { schemaWithResolvers, repository } from "@labelflow/db";
import { getSession } from "next-auth/react";
import { captureException } from "@sentry/nextjs";

const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
  context: async ({ req }) => {
    const session = await getSession({ req });
    // Block all queries by unauthenticated users
    // This will need to be removed once we want to have public datasets
    if (typeof session?.user.id !== "string") {
      throw new AuthenticationError(
        "User must be signed in to perform GraphQL queries."
      );
    }
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
