/**
 * Asserts that the given value is in the first enum argument
 * @param enumType - The enum type to look at
 * @param value - The value to compare against the enum values
 * @returns True if the value arg matches one of the enum values, false otherwise
 */
export const isEnumValue = <
  TEnum extends Record<TEnumKey, string | number>,
  TEnumKey extends keyof TEnum = keyof TEnum
>(
  enumType: TEnum,
  value: string | number | undefined | null
): value is TEnum[TEnumKey] =>
  Object.values(enumType).some((enumValue) => enumValue === value);
