import { capitalCase } from "change-case";

/**
 * Returns the storybook title prefixed with the common path
 * @param parts - Storybook parts to join with a `/` (accepts function components)
 * @return Generated Storybook title path
 */
export const storybookTitle = (...parts: (string | Function)[]) => {
  const path = parts
    .map((part) => (typeof part === "string" ? part : part.name))
    .map((part) => capitalCase(part))
    .join("/");
  return `web/${path}`;
};
