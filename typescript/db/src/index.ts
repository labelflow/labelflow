import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";

const schema = loadSchemaSync(
  join(__dirname, "../../../data/__generated__/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    projects: () => {
      return prisma.project.findMany();
    },
  },
};

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({
  introspection: true,
  context: {},
  schema: schemaWithResolvers,
});

server.listen({ port: 5000 }).then(async ({ url }) => {
  console.log(`\
  🚀 Server ready at: ${url}
  ⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
    `);
});
