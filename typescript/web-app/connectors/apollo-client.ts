import { makeExecutableSchema } from "@apollo-model/graphql-tools";
import { SchemaLink } from "@apollo/client/link/schema";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import localforage from "localforage";

const typeDefs = `
  scalar DateTime
  scalar Json

  type Query {
    hello: String
    projects(first: Int): [Project!]!
  }

  type Project {
      id:        Int
      createdAt: DateTime
      updatedAt: DateTime
      name:      String
  }

  type Mutation {
    addProject(name:String!):Project
  }

  
`;

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
    projects: () => {
      return localforage.getItem("projectList");
    },
  },
  Mutation: {
    addProject: async (_: any, args: { name: string }) => {
      const newProject = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: Math.floor(Math.random() * 1000000),
        name: args?.name,
      };
      const oldProjectList = await localforage.getItem("projectList");
      const newProjectList =
        oldProjectList === undefined || oldProjectList === null
          ? [newProject]
          : [...(oldProjectList as []), newProject];
      await localforage.setItem("projectList", newProjectList);
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const client = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
});
