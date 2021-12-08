export const forbiddenWorkspaceSlugs = [
  "404",
  "about",
  "api",
  "auth",
  "debug",
  "docs",
  "graphiql",
  "help",
  "index",
  "legal",
  "local",
  "posts",
  "pricing",
  "request-access",
  "settings",
  "static",
  "terms",
  "thank-you",
  "website",
  "workspaces",
];

export const IS_VALID_WORKSPACE_NAME_REGEX = /^[0-9a-z]+([-\s]?[0-9a-z]+)*$/i;

/**
 * Checks that the name only contains a mix of:
 *   - numbers from 0 to 9
 *   - characters from a to z and A to Z
 *   - spaces
 *   - hyphens (`-`)
 */
export const isValidWorkspaceName = (name: string): boolean =>
  IS_VALID_WORKSPACE_NAME_REGEX.test(name);
