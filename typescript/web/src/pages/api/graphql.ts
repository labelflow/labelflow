import { NextApiHandler } from "next";
import { ApolloServer } from "apollo-server-micro";
import { schemaWithResolvers, repository } from "@labelflow/db";
import { getSession } from "next-auth/react";
import { captureException } from "@sentry/nextjs";

const createHandler = async () => {
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
  await apolloServer.start();
  return apolloServer.createHandler({ path: "/api/graphql" });
};

const handlerPromise = createHandler();
let handler: NextApiHandler | null = null;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleRequest: NextApiHandler = async (req, res) => {
  if (handler == null) {
    handler = await handlerPromise;
  }
  return await handler(req, res);
};

export default handleRequest;
