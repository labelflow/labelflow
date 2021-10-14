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
  "static",
  "terms",
  "thank-you",
  "website",
  "workspaces",
];

/**
 * Checks that the name contains a mix of:
 *   - numbers from 0 to 9
 *   - characters from a to z and A to Z
 *   - spaces
 *   - hyphens (`-`)
 *
 * Feel free to add additional checks if needed.
 */
export const isValidWorkspaceName = (name: string): boolean =>
  /^[0-9a-z\-\s]*$/i.test(name);
