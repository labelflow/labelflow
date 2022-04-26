export const APP_NAME = "LabelFlow";

export const APP_TITLE = `${APP_NAME}: The open standard platform for image labeling.`;

export const APP_DESCRIPTION =
  "The fastest and simplest image labeling tool on the Internet!";

export const APP_OFFICIAL_URL = "https://labelflow.ai";

export const APP_GITHUB_URL = "https://github.com/labelflow/labelflow";

export const APP_NEW_EXPORT_REQUEST_URL =
  "https://labelflow.canny.io/export-formats";

export const WEB_APP_URL_ORIGIN =
  process.env.NEXTAUTH_URL ??
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
  APP_OFFICIAL_URL;

/** Public documentation URL */
export const DOCUMENTATION_URL = "https://docs.labelflow.ai";

export const LAST_WORKSPACE_ID_COOKIE_NAME = "lastWorkspaceId";
