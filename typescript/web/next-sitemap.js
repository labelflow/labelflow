const { LABELFLOW_URL } = process.env;

if (!LABELFLOW_URL) {
  throw new Error("Missing required environment variable LABELFLOW_URL");
}

module.exports = {
  siteUrl: LABELFLOW_URL,
  exclude: [
    "/settings/profile",
    "/debug",
    "/thank-you",
    "/request-access",
    "/graphiql",
  ],
};
