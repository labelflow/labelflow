type ObjectWithoutNulls<T> = {
  [key in keyof T]: Exclude<T[key], null>;
};

export function castObjectNullsToUndefined<T>(
  item: T | undefined | null
): ObjectWithoutNulls<T>;
export function castObjectNullsToUndefined(item: undefined | null): undefined;

export function castObjectNullsToUndefined<T>(
  item: T | undefined | null
): ObjectWithoutNulls<T> | undefined {
  if (item) {
    return Object.fromEntries(
      Object.entries(item as Object).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    ) as ObjectWithoutNulls<T>;
  }
  return undefined;
}
