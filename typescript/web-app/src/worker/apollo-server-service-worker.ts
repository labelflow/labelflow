/* eslint-env serviceworker */
// This is a fork of https://github.com/stutrek/apollo-server-service-worker , which seems unmaintained and has an MIT license.
// This puts Apollo Server inside a service worker. You can back it with IndexedDB, your API, whatever you need.
// This will let you use a DB sync protocol, such as [PC]ouchDB or Dexie. Syncable to keep a local database in sync while providing a GraphQL API to the windows.
// See https://github.com/stutrek/apollo-server-service-worker/blob/master/src/ApolloServer.ts
// See https://github.com/stutrek/apollo-server-service-worker/blob/master/src/serviceWorkerApollo.ts
import {
  ApolloServerBase,
  GraphQLOptions,
  runHttpQuery,
} from "apollo-server-core";
import type { Request as ApolloRequest } from "apollo-server-env";
import { RouteHandlerCallbackOptions, RouteHandlerObject } from "workbox-core";

import { resetDatabase } from "../connectors/database";

const maxRetries = 1;

/**
 * The function that actually processes the request
 */
async function graphQLServiceWorker(
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
    console.error(error);
    if (retries < maxRetries) {
      console.log("Problem with the database, retrying after reset");
      resetDatabase();
      return graphQLServiceWorker(request, options, retries + 1);
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

/**
 * A class to bridge between ApolloServerBase and workbox RouteHandlerObject
 */
export class ApolloServerServiceWorker
  extends ApolloServerBase
  implements RouteHandlerObject
{
  async handle({ request }: RouteHandlerCallbackOptions): Promise<Response> {
    const options = await this.graphQLServerOptions({
      req: request,
    });
    const response = await graphQLServiceWorker(
      request as unknown as ApolloRequest,
      options
    );
    return response;
  }
}
