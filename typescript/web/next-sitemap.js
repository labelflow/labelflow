const { VERCEL_URL } = process.env;

if (!VERCEL_URL) {
  throw new Error("Missing required environment variable VERCEL_URL");
}

const SITE_URL = VERCEL_URL.includes("://")
  ? VERCEL_URL
  : `https://${VERCEL_URL}`;

module.exports = {
  siteUrl: SITE_URL,
  exclude: [
    "/settings/profile",
    "/debug",
    "/thank-you",
    "/request-access",
    "/graphiql",
  ],
};
