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
      options: {},
    },
  },
});
