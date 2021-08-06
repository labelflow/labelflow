import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";

import { resolvers } from "./resolvers";

export { repository } from "./repository";

const filePath = join(__dirname, "../../../data/__generated__/schema.graphql");

export const schema = loadSchemaSync(filePath, {
  loaders: [new GraphQLFileLoader()],
});

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});
