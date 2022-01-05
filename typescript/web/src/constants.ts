export const WEB_APP_URL_ORIGIN =
  process.env.NEXTAUTH_URL ??
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
  "https://labelflow.ai";
