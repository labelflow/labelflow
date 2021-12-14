module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("STRAPI_DATABASE_HOST", ""),
        port: env.int("STRAPI_DATABASE_PORT", 5432),
        database: env("STRAPI_DATABASE_NAME", ""),
        username: env("STRAPI_DATABASE_USERNAME", ""),
        password: env("STRAPI_DATABASE_PASSWORD", ""),
        ssl: env.bool("STRAPI_DATABASE_SSL", false),
        schema: env("STRAPI_DATABASE_SCHEMA", "public"),
      },
      options: { autoMigration: false }, // Avoid having the tables/columns creation on each server start (see https://github.com/strapi/strapi/pull/1517/files#diff-c3c034f05fdf9e53e763135134dee072445cb802dfb83d17d23d5a1811f91ba0R185)
    },
  },
});
