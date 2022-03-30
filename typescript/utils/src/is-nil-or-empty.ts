import { isEmpty } from "lodash/fp";

/**
 * Returns true if the given value is undefined, null or empty, false otherwise
 * @remarks
 * Also asserts that the value is undefined to get the compiler consider it as
 * unusable and allow early-returns such as:
 * ```ts
 * if (isEmpty(foo)) return "Default value";
 * // Do something with foo now considered as non-nullable by the compiler
 * ```
 * @param value - Value to test
 * @returns True if the value is not empty, false otherwise
 */
export const isNilOrEmpty = <TValue>(
  value: TValue | null | undefined
): value is null | undefined => isEmpty(value);
