import { isEmpty, isNil } from "lodash/fp";
import { getSlug } from "./get-slug";

/**
 * List of reserved slugs reserved for internal purposes
 */
export const FORBIDDEN_WORKSPACE_SLUGS = [
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
  "open",
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

/**
 * Checks that the name only contains a mix of:
 *   - numbers from 0 to 9
 *   - characters from a to z and A to Z
 *   - spaces
 *   - hyphens (`-`)
 */
export const WORKSPACE_NAME_REGEX = /^[0-9a-z]+([-\s]?[0-9a-z]+)*$/i;

export enum WorkspaceNameErrorType {
  emptyName = "emptyName",
  invalidNameCharacters = "invalidNameCharacters",
  emptySlug = "emptySlug",
  forbiddenSlug = "forbiddenSlug",
  workspaceExists = "workspaceExists",
}

export const validateWorkspaceName = (
  name: string,
  slug: string = getSlug(name)
): WorkspaceNameErrorType | undefined => {
  if (isEmpty(name)) {
    return WorkspaceNameErrorType.emptyName;
  }
  if (!WORKSPACE_NAME_REGEX.test(name)) {
    return WorkspaceNameErrorType.invalidNameCharacters;
  }
  if (isEmpty(slug)) {
    return WorkspaceNameErrorType.emptySlug;
  }
  if (FORBIDDEN_WORKSPACE_SLUGS.includes(slug)) {
    return WorkspaceNameErrorType.forbiddenSlug;
  }
  return undefined;
};

export const INVALID_WORKSPACE_NAME_MESSAGES: Record<
  keyof typeof WorkspaceNameErrorType,
  string
> = {
  emptyName: "Name is empty",
  invalidNameCharacters: "Name contains invalid characters",
  emptySlug: "Slug is empty",
  forbiddenSlug: "This name is reserved",
  workspaceExists: `A workspace with this name already exists`,
};

export const validWorkspaceName = (
  name: string,
  slug: string = getSlug(name)
): void => {
  const error = validateWorkspaceName(name, slug);
  if (!isNil(error)) {
    throw new Error(INVALID_WORKSPACE_NAME_MESSAGES[error]);
  }
};
