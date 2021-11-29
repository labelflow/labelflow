/* eslint-disable no-await-in-loop */
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { typeDefs, resolvers, repository } from "@labelflow/db";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getSession } from "next-auth/react";
import { execute, parse } from "graphql";
import { captureException } from "@sentry/nextjs";

const maxRetries = 1;

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const createContext = async ({
  req,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getSession({ req });
  return { repository, session, user: session?.user, req };
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { query, variables, operationName } = req.body;

  const documentAst = parse(query);

  let retries = 0;
  let error: Error | null = null;

  while (retries < maxRetries) {
    try {
      const graphqlResult = await execute({
        schema: executableSchema,
        document: documentAst,
        variableValues: variables,
        operationName,
        contextValue: await createContext({ req, res }),
      });

      res
        .status((graphqlResult.errors?.length ?? 0) > 0 ? 400 : 200)
        .json(graphqlResult);

      return;
    } catch (e: any) {
      // await resetDatabase();
      retries += 1;
      error ??= error;
    }
  }

  console.error("Error while running graphql query", error);

  captureException(error);

  res.status(400).json({ error });
};

export default handleRequest;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
