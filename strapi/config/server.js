module.exports = ({ env }) => ({
  host: env('STRAPI_HOST', env('HOST', '0.0.0.0')),
  port: env.int('STRAPI_PORT', env.int('PORT', 1337)),
  admin: {
    auth: {
      secret: env('STRAPI_ADMIN_JWT_SECRET', ''),
    },
  },
});
