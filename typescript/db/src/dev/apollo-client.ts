/* eslint-disable import/no-extraneous-dependencies */
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";

import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";

import { resolvers } from "../resolvers";
import { repository } from "../repository";

const schema = loadSchemaSync(
  join(__dirname, "../../../../data/__generated__/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

export const user: { id: string | undefined } = { id: undefined };

export const client = new ApolloClient({
  link: new SchemaLink({
    schema: schemaWithResolvers,
    context: { repository, user },
  }),
  cache: new InMemoryCache(),
});
