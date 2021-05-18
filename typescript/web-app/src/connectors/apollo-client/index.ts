import { makeExecutableSchema } from "@apollo-model/graphql-tools";
import { SchemaLink } from "@apollo/client/link/schema";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import typeDefs from "../../../../../data/type-defs.graphql";
import { resolvers } from "./resolvers";

// const resolvers = {
//   Query: {
//     hello: () => {
//       return "Hello world!";
//     },

//     project: async (id: string) => {
//       return localforage.getItem(`project:${id}`);
//     },
//     projects: async () => {
//       const projectKeysList = await localforage.getItem("projectList");
//       if (((projectKeysList as [])?.length ?? 0) === 0) {
//         return [];
//       }
//       const projects = await Promise.all(
//         (projectKeysList as []).map((key: string) => localforage.getItem(key))
//       );
//       return projects;
//     },
//   },
//   Mutation: {
//     addProject: async (_: any, args: { name: string }) => {
//       const newProject = {
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         id: Math.floor(Math.random() * 1000000).toString(),
//         name: args?.name,
//       };
//       // Set project in db
//       const newProjectKey = `Project:${newProject.id}`;
//       await localforage.setItem(newProjectKey, newProject);
//       // Add project to project list
//       const oldProjectKeysList = await localforage.getItem("projectList");
//       const newProjectList =
//         oldProjectKeysList === undefined || oldProjectKeysList === null
//           ? [newProjectKey]
//           : [...(oldProjectKeysList as []), newProjectKey];
//       await localforage.setItem("projectList", newProjectList);
//     },
//   },
// };

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const client = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
});
