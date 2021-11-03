/* eslint-disable no-await-in-loop */
/* eslint-env serviceworker */

import { makeExecutableSchema } from "@graphql-tools/schema";
import type { IExecutableSchemaDefinition } from "@graphql-tools/schema/types";
import { GraphQLSchema, execute, parse } from "graphql";
import { RouteHandlerCallbackOptions, RouteHandlerObject } from "workbox-core";

import { resetDatabase } from "../connectors/database";

const maxRetries = 1;

export class GraphqlServerServiceWorker implements RouteHandlerObject {
  schema: GraphQLSchema;

  context: (ctx: { req: Request; res: Response }) => any;

  constructor(
    config: IExecutableSchemaDefinition<any> & {
      context: (ctx: { req: Request; res: Response }) => any;
    }
  ) {
    const { context, ...rest } = config;
    this.context = context;
    this.schema = makeExecutableSchema({
      ...rest,
    });
  }

  async handle({ request }: RouteHandlerCallbackOptions): Promise<Response> {
    const { query, variables, operationName } = await request.json();

    const documentAst = parse(query);

    let retries = 0;
    let error = null;

    while (retries < maxRetries) {
      try {
        const graphqlResult = await execute({
          schema: this.schema,
          document: documentAst,
          variableValues: variables,
          operationName,
          contextValue: this.context({ req: request, res: new Response() }),
        });

        const responseResult = JSON.stringify(graphqlResult);

        const response = new Response(responseResult, {
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "application/json",
            "Content-Length": responseResult.length.toString() ?? "0",
          }),
        });

        return response;
      } catch (e: any) {
        await resetDatabase();
        retries += 1;
        error = error ?? e;
      }
    }
    console.error("Error while running graphql query", error);

    if (error.name !== "HttpQueryError") {
      throw error;
    }

    const response = new Response(error.message, {
      status: error.statusCode,
      statusText: error.statusText,
    });

    if (error.headers) {
      Object.entries(error.headers ?? {}).forEach(([name, value]) => {
        response.headers.set(name, value as string);
      });
    }
    return response;
  }
}
