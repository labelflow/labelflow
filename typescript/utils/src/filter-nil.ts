import { isNil } from "lodash/fp";

/**
 * Filters the array from null or undefined values
 * @remarks Helps removing the `undefined` and `null` values from the array subtype
 * @param values - The array to clean
 * @returns Array without undefined or null values
 */
export const filterNil = <TValue>(
  values: Array<TValue>
): Array<NonNullable<TValue>> => {
  const filtered = values.filter((value) => !isNil(value));
  return filtered as NonNullable<TValue>[];
};
