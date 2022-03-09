import { isEmpty as lodashIsEmpty } from "lodash/fp";

/**
 * Overrides Lodash `isEmpty` to assert that the value is also NonNullable
 * @remarks
 * This is permitted only because the Lodash `isEmpty` function also returns
 * `true` if `value==null`.
 * @param value - Value to test
 * @returns True if the value is empty, false otherwise
 */
export const isEmpty = <TValue>(
  value: TValue | null | undefined
): value is NonNullable<TValue> => lodashIsEmpty(value);
