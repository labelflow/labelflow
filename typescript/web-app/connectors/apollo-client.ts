import { makeExecutableSchema } from "@apollo-model/graphql-tools";
import { SchemaLink } from "@apollo/client/link/schema";
import { ApolloClient, InMemoryCache } from "@apollo/client";

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

  schema {
    query: Query
  }
`;

const resolvers = {
  Query: {
    hello: (root, args, context, info) => {
      return "Hello world!";
    },
    projects: (root, args, context, info) => {
      return [
        {
          id: 123,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          name: "test",
        },
      ];
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
