// import { addResolversToSchema } from "@graphql-tools/schema";

import { resolvers as resolversImport } from "./resolvers";

import { typeDefs as typeDefsImport } from "./__generated__/schema";

export { repository } from "./repository";

export const resolvers = resolversImport;

export const typeDefs = typeDefsImport;

// export const schemaWithResolvers = addResolversToSchema({
//   schema,
//   resolvers,
// });

export * from "./prisma-client";
