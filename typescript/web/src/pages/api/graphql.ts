/* eslint-disable no-await-in-loop */
import { makeExecutableSchema } from "@graphql-tools/schema";
import { repository, resolvers, typeDefs } from "@labelflow/db";
import { captureException } from "@sentry/nextjs";
import { execute, parse } from "graphql";
import { isEmpty, isNil } from "lodash/fp";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { reEncodeJwt } from "../../utils";

const DEBUG = !isEmpty(process.env.DEBUG);

const getAuthorizationHeader = async (req: NextApiRequest): Promise<string> => {
  const jwt = await reEncodeJwt(req);
  return `Bearer ${jwt}`;
};

const redirectIfNeeded = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  const backendUrl = process.env.BACKEND_URL;
  if (isNil(backendUrl) || isEmpty(backendUrl)) return false;
  const authorization = await getAuthorizationHeader(req);
  const headers = {
    "content-type": "application/json",
    Authorization: authorization,
  };
  const { method } = req;
  const body = JSON.stringify(req.body);
  const fetchRes = await fetch(backendUrl, { method, headers, body });
  res.send(fetchRes.body);
  res.status(fetchRes.status);
  const print = DEBUG ? console.debug : console.error;
  if (DEBUG) {
    print(JSON.stringify(req.body, undefined, 2));
  }
  if (DEBUG || !fetchRes.ok) {
    try {
      const json = await fetchRes.json();
      print(JSON.stringify(json, undefined, 2));
    } catch {
      print(await fetchRes.text());
    }
  }
  return true;
};

const maxRetries = 1;

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const createContext = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  return { repository, session, user: session?.user, req };
};

const handleRequest: NextApiHandler = async (req, res) => {
  const redirect = await redirectIfNeeded(req, res);
  if (redirect) return;

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
        contextValue: await createContext(req),
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
