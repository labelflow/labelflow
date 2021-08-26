import { ApolloServer } from "apollo-server";
import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";

import { resolvers } from "./resolvers";
import { repository } from "./repository";

const schema = loadSchemaSync(
  join(__dirname, "../../../data/__generated__/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({
  introspection: true,
  context: { repository },
  schema: schemaWithResolvers,
});

server.listen({ port: 5000 }).then(async ({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`\
  🚀 Server ready at: ${url}
  ⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
    `);
});
