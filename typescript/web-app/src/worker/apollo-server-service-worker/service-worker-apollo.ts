/* eslint-env serviceworker */
// https://github.com/stutrek/apollo-server-service-worker/blob/master/src/serviceWorkerApollo.ts
import { GraphQLOptions, runHttpQuery } from "apollo-server-core";

import type { Request as ApolloRequest } from "apollo-server-env";

import { resetDatabase } from "../../connectors/database";

export async function graphQLServiceWorker(
  request: ApolloRequest,
  options: GraphQLOptions,
  retries = 0
): Promise<Response> {
  if (!options) {
    throw new Error("Apollo Server requires options.");
  }

  try {
    const { graphqlResponse, responseInit } = await runHttpQuery([], {
      method: request.method.toUpperCase(),
      options,
      query:
        request.method === "POST"
          ? await request.json()
          : JSON.parse(request.url.split("?")[1]),
      request,
    });

    const response = new Response(graphqlResponse);

    Object.entries(responseInit.headers ?? {}).forEach(([name, value]) => {
      response.headers.set(name, value as string);
    });

    return response;
  } catch (error) {
    if (retries < 1) {
      console.log("Problem with the database, retrying after reset");
      resetDatabase();
      return graphQLServiceWorker(request, options, 1);
    }

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
