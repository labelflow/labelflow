/* eslint-env serviceworker */
// See https://github.com/stutrek/apollo-server-service-worker/blob/master/src/ApolloServer.ts
import {
  ApolloServerBase,
  // , GraphQLOptions
} from "apollo-server-core";

import { graphQLServiceWorker } from "./service-worker-apollo";

declare let self: ServiceWorkerGlobalScope;

export class ApolloServer extends ApolloServerBase {
  installListener(path = "/api/worker/graphql") {
    self.addEventListener("fetch", (event: any) => {
      const { request } = event;
      const url = new URL(request.url);
      if (url.pathname !== path) {
        return;
      }
      const buildResponse = async () => {
        const options = await this.graphQLServerOptions({
          req: request,
        });
        const response = await graphQLServiceWorker(request, options);
        return response;
      };
      event.respondWith(buildResponse());
    });
  }
}
