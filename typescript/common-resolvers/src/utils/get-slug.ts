import slugify from "slugify";

/**
 * Converts the display name of a resource into a simplified slug
 * @param name - The name to slugify
 * @returns A param-cased string representation of the name
 */
export const getSlug = (name: string): string => slugify(name, { lower: true });
