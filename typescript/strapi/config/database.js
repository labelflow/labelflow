const fs = require("fs");
const path = require("path");

module.exports = ({ env }) => {
  return ({
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'postgres',
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          username: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          schema: env('DATABASE_SCHEMA', 'public'), // Not Required
          ssl: {
            // rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
            ca: fs.readFileSync(path.resolve(__dirname, "../ca-certificate.crt")).toString(),
          }
        },
        options: {
          // useNullAsDefault: true,
        },
      },
    },
  })
};
