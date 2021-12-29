import { ApolloServer } from "apollo-server";
import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { resolvers } from "../resolvers";
import { repository } from "../repository";
import { getPrismaClient } from "../prisma-client";

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

const server = new ApolloServer({
  introspection: true,
  context: async ({ req }) => {
    // Get user ID from session token stored in cookie
    const cookie = req?.headers?.cookie;
    const parsedCookie =
      cookie != null
        ? Object.fromEntries(
            cookie.split(/; */).map((c) => {
              const [key, ...v] = c.split("=");
              return [key, decodeURIComponent(v.join("="))];
            })
          )
        : {};
    const session = await (
      await getPrismaClient()
    ).session.findUnique({
      where: { sessionToken: parsedCookie?.["next-auth.session-token"] },
    });
    return { repository, user: { id: session?.userId } };
  },
  schema: schemaWithResolvers,
  cors: true,
});

if (require.main === module) {
  server.listen({ port: 5000 }).then(async ({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`\
    🚀 Server ready at: ${url}
    ⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
      `);
  });
}
