import { ApolloServer } from "./apollo-server-service-worker";
import typeDefs from "../../../../data/__generated__/schema.graphql";
import { resolvers } from "../connectors/apollo-client/resolvers";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// ///////////////////// Fake implementation to test the service worker
// declare let self: ServiceWorkerGlobalScope;
// export const server = {
//   installListener: (path = "/graphql") => {
//     console.log("Youhouuu");
//     self.addEventListener("fetch", (event: any) => {
//       const { request } = event;
//       const url = new URL(request.url);
//       console.log("apollo service worker answering random request");
//       if (url.pathname !== path) {
//         return;
//       }
//       console.log("It's a gql request!");
//       event.respondWith(
//         (async () => {
//           const response = new Response("Hi", {
//             status: 200,
//             statusText: "ok",
//           });
//           return response;
//         })()
//       );
//     });
//   },
// };
