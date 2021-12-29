import { isNil } from "lodash/fp";

/**
 * Reads the value of the environment variable whose name is specified as first
 * argument. Throws an error if the environment variable is not defined and no
 * default value has been given as second argument.
 * @param name - Name of the environment variable to read
 * @param defaultValue - Optional default value to return if the environment
 * variable is not defined
 * @returns Value of the environment variable if any, otherwise returns the
 * default value if specified, else throws an error
 */
export const getEnv = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!isNil(value)) return value;
  if (!isNil(defaultValue)) return defaultValue;
  throw new Error(`Environment variable ${name} is required`);
};
