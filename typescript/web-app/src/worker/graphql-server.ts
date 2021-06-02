import gql from "graphql-tag";
import { ApolloServer } from "./apollo-server-service-worker";

// type checking
// query vs. mutation
// objects
// arrays
// arguments

// crud

const typeDefs = gql`
  type Query {
    hello(name: String): String
    user: User
  }

  type User {
    id: ID!
    username: String
    firstLetterOfUsername: String
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    errors: [Error!]!
    user: User
  }

  input UserInfo {
    username: String!
    password: String!
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
  }
`;

const resolvers = {
  User: {
    firstLetterOfUsername: (parent: any) => {
      return parent.username ? parent.username[0] : null;
    },
    // username: parent => { return parent.username;
    // }
  },
  Query: {
    hello: (_parent: any, { name }: any) => {
      return `hey ${name}`;
    },
    user: () => ({
      id: 1,
      username: "tom",
    }),
  },
  Mutation: {
    login: async (_parent: any, { userInfo: { username } }: any) =>
      //   context: any
      {
        // check the password
        // await checkPassword(password);
        return username;
      },
    register: () => ({
      errors: [
        {
          field: "username",
          message: "bad",
        },
        {
          field: "username2",
          message: "bad2",
        },
      ],
      user: {
        id: 1,
      },
    }),
  },
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// /// ////////////////// Fake
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
