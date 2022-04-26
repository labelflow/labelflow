import { isEmpty, isNil } from "lodash/fp";
import { isEnumValue } from "./is-enum-value";

/**
 * Converts a string to an enum value
 * @param enumType - Type of the enum value
 * @param value - Value to convert to enum value
 * @param defaultValue - Optional default value if value arg is empty
 * @returns The value converted as an enum value if it exists, throws an error otherwise
 */
export const toEnumValue = <
  TEnum extends Record<TEnumKey, string | number>,
  TEnumKey extends keyof TEnum = keyof TEnum
>(
  enumType: TEnum,
  value: string | number | undefined | null,
  defaultValue?: TEnum[TEnumKey]
): TEnum[TEnumKey] => {
  if (isEnumValue<TEnum, TEnumKey>(enumType, value)) return value;
  if (!isNil(defaultValue)) return defaultValue;
  const msg = isEmpty(value)
    ? `Enum value is empty`
    : `Enum value "${value}" does not exist`;
  throw new Error(msg);
};
